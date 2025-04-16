import {DataModel} from '../model/server.datamodel';
import {UserCredentials, UserJWT, UserJWTPayload} from '../../app/model/repository/user-logon.model';
import moment from 'moment/moment';
import CryptoJS from 'crypto-js';
import fs from 'node:fs';

export class AuthService {

  protected readonly PUBLIC_KEY:string = fs.readFileSync('public.key', 'utf-8');

  constructor(private readonly serverDb: DataModel) {

  }

  // Signs User Credentials:  Creates JWT bearer token information using express-jwt
  //
  public logon(credentials:UserCredentials) {

    let payload:UserJWTPayload | undefined;
    let token:string | undefined;

    // User Token Exists
    if (this.serverDb.userTokenMap.has(credentials.userName)) {

      // -> Token Valid
      if (this.verify(this.serverDb.userTokenMap.get(credentials.userName) || "") &&
          this.serverDb.tokenMap.has(credentials.userName)) {
        payload = this.serverDb.tokenMap.get(credentials.userName);
        token = this.serverDb.userTokenMap.get(credentials.userName);
      }
    }

    // Return existing session
    if (payload && token) {
      return UserJWT.fromLogon(credentials.userName, token, payload.loginTime, payload.expirationTime);
    }

    // Create payload to store user name and logon time (+ 120 minutes)
    //
    payload = new UserJWTPayload(credentials.userName, moment().toDate(), moment().add(120, 'minutes').toDate());

    // Encrypt JWT Payload
    //
    token = CryptoJS.AES.encrypt(JSON.stringify(payload), this.PUBLIC_KEY).toString();

    // Store JWT Session Info
    //
    this.serverDb.tokenMap.set(token, payload);
    this.serverDb.userTokenMap.set(credentials.userName, token);

    return UserJWT.fromLogon(credentials.userName, token, payload.loginTime, payload.expirationTime);
  }

  // Removes User Session
  public logoff(token:string) {
    if (this.serverDb.userTokenMap.has(token)) {
      this.serverDb.userTokenMap.delete(token);
      this.serverDb.tokenMap.delete(token);
    }
  }

  // Verifies:  1) User session exists for the given token; 2) That the session has not expired
  public verify(token: string): UserJWTPayload | undefined {

    if (this.serverDb.tokenMap.has(token) &&
        moment().isBefore(moment(this.serverDb.tokenMap.get(token)?.expirationTime))) {
      return this.serverDb.tokenMap.get(token);
    }

    return undefined;
  }
}
