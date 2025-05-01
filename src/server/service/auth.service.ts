import moment from 'moment/moment';
import CryptoJS from 'crypto-js';
import fs from 'node:fs';
import { EntityController } from '../entity/entity-controller';
import {UserJWT} from '../entity/model/UserJWT';
import {UserJWTClientDTO} from '../../app/model/client-dto/UserJWTClientDTO';
import { UserCredentialClientDTO } from '../../app/model/client-dto/UserCredentialClientDTO';
import { User } from '../entity/model/User';
import { UserCredential } from '../entity/model/UserCredential';
import {ServerLogger} from '../server.logger';

export class AuthService {

  protected readonly PUBLIC_KEY:string = fs.readFileSync('public.key', 'utf-8');

  constructor(private readonly entityController:EntityController, private readonly serverLogger:ServerLogger) {

  }

  // Signs User Credentials:  Creates JWT bearer token information using express-jwt
  //
  public logon(credentials:UserCredentialClientDTO) {

    // Validation
    if (!credentials.password || credentials.password.trim() == '' ||
      !credentials.userName || credentials.userName.trim() == '') {
      return Promise.reject("User name / password are required");
    }

    return new Promise<UserJWT>(async (resolve, reject) => {

      // -> User
      this.getUser(credentials.userName.trim())
        .then((user) => {

          // -> UserCredential
          this.getUserCredentials(credentials.userName.trim())
            .then((userCredential) => {

              // VALIDATE USER:  Password
              if (credentials.password != userCredential.Password) {
                reject("Invalid Password");
              } else {

                // -> User Session
                this.getUserJWT(user.Id).then((userJWTCredential) => {

                  // Expired Token!
                  if (moment().isBefore(moment(userJWTCredential.ExpirationTime))) {

                    // -> Evict Token
                    this.evictSession(userJWTCredential).then((success) => {
                      if (!success) {
                        reject("Error evicting user session. Logon Failed!");
                      } else {
                        // -> New Session
                        this.createSession(userCredential).then(session => {

                          // Resolve (New Session Created)
                          resolve(session);
                        }, message => {
                          reject(message);
                        });
                      }
                    }, message => {
                      reject(message);
                    });
                  }

                  // Valid Session! Resolve!
                  else {
                    resolve(userJWTCredential);
                  }

                  // -> Not Found (UserJWT)
                }, (message) => {

                  // (No Session Found) -> New Session
                  this.createSession(userCredential).then(session => {

                    // Resolve! (New Session Created)
                    resolve(session);
                  }, message => {
                    reject(message);
                  });

                });
              }

              // -> Not Found (UserCredential)
            }, message => {
              reject(message);
            });

          // -> Not Found (User)
        }, message => {
          reject(message);
        }).catch((error) => {

        // ERROR:  Log -> Reject
        this.serverLogger.logError("LOGON ERROR:  See server log for details");
        this.serverLogger.logError(error);
        reject(error);
      });
    });
  }

  // Removes User Session
  public logoff(token:string) {
    return new Promise<boolean>((resolve, reject) => {
      this.getUserSession(token).then((entity) => {
        if (entity) {
         this.entityController.userJWTs.remove(entity)?.then(result => {
           resolve(result === 1);
         }, message => {
           reject(message);
         });
        }
      }, message => {
        reject(message);
      });
    });
  }

  // Verifies:  1) User session exists for the given token; 2) That the session has not expired
  public verify(token: string) {

    return new Promise<boolean>((resolve, reject) => {
      this.getUserSession(token).then(session => {
        if (session) {
          resolve(moment().isAfter(moment(session.ExpirationTime)));
        }
        else {
          reject("User session not found");
        }
      }, message => {
        reject(message);
      });
    });
  }

  public getUserSession(token:string) {
    return this.entityController.userJWTs.where({
      Token: token
    }).then((value) => {

      let sessions = value as UserJWT[];
      if (sessions.length != 1)
        return undefined;

      else {
        return sessions[0] as UserJWT;
      }

    }).catch((error) => {
      this.serverLogger.logError("Authentication Error:  See server log for details");
      this.serverLogger.logError(error);
      return undefined;
    });
  }


  // Creates new session token for valid user / user credentials
  protected createSession(userCredential:UserCredential):Promise<UserJWT> {

    // Create payload to store user name and logon time (+ 120 minutes)
    //
    let expiration = moment().add(120, 'minutes').toDate();
    let payload = new UserJWTClientDTO(userCredential.User.Name, new Date(), expiration);

    // Encrypt JWT Payload
    //
    let token = CryptoJS.AES.encrypt(JSON.stringify(payload), this.PUBLIC_KEY).toString();

    // Store JWT Session Info
    //
    let newJWT = new UserJWT();
    newJWT.UserId = userCredential.UserId;
    newJWT.Token = token;
    newJWT.ExpirationTime = expiration;
    newJWT.LoginTime = new Date();

    return new Promise<UserJWT>(async (resolve, reject) => {
      await this.entityController
                .userJWTs
                .append(newJWT)
                ?.then(value => {
                  resolve(value as UserJWT);
                }, message => {
                  reject(message);
                })
                .catch((error) => {
                  reject(error);
                });
    });
  }

  // Removes the user session from the database
  protected evictSession(session:UserJWT) {
    return new Promise<boolean>((resolve, reject) => {
      this.entityController
        .userJWTs
        .remove(session)
        ?.then(removed => {
          resolve(removed === 1);
        });
      });
  }

  // Returns promise for getting user from the database
  protected getUser(userName:string):Promise<User> {

    return new Promise((resolve, reject) => {
      this.entityController
        .users
        .firstBy(x => x.Name === userName)
        .then(user => {
          if (!user) {
            reject("Authentication Failed:  User not found");
          } else {
            resolve(user);
          }
      });
    });
  }

  // Returns promise for getting user credential from the database
  protected getUserCredentials(userName:string):Promise<UserCredential> {

    return new Promise((resolve, reject) => {
      this.entityController
        .userCredentials
        .firstBy(x => x.User.Name === userName).then(credentials => {
        if (!credentials) {
          reject("Authentication Failed:  User Credentials not found");
        } else {
          resolve(credentials);
        }
      });
    });
  }

  // Returns promise for getting session from the database
  protected getUserJWT(userId:number):Promise<UserJWT> {

    return new Promise((resolve, reject) => {
      this.entityController
        .userJWTs
        .firstBy(x => x.UserId === userId).then(session => {
        if (!session) {
          reject("User session not found");
        } else {
          resolve(session);
        }
      });
    });
  }
}
