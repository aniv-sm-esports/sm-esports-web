import isEqual from 'lodash/isEqual';
import {User} from '../repository/entity/user.model';

export class UserCredentials {

  public userName: string = '';
  public password: string = '';

  public static fromLogon(userName:string, password:string): UserCredentials {
    let result:UserCredentials = new UserCredentials();

    result.userName = userName;
    result.password = password;

    return result;
  }
}

export class UserJWTPayload {
  public userName: string = '';
  public loginTime: Date = new Date();
  public expirationTime: Date = new Date();

  constructor(userName:string, loginTime:Date, expirationTime:Date) {
    this.userName = userName;
    this.loginTime = loginTime;
    this.expirationTime = expirationTime;
  }
}

export class UserJWT {

  public token: string = '';
  public expiresAt: Date = new Date();
  public loggedinAt: Date = new Date();
  public userName: string = '';

  public isDefault() {
    return isEqual(this, UserJWT.default());
  }

  public static default() {
    let result:UserJWT = new UserJWT();
    result.token = '';
    result.expiresAt = new Date();
    result.loggedinAt = new Date();
    result.userName = '';
    return result;
  }

  public static from(data:UserJWT | undefined): UserJWT {
    if (!data)
      return UserJWT.default();

    let result:UserJWT = new UserJWT();
    result.token = data.token;
    result.expiresAt = data.expiresAt;
    result.loggedinAt = data.loggedinAt;
    result.userName = data.userName;
    return result;
  }

  public static fromLogon(userName:string, token:string, loggedInAt:Date, expiresAt:Date): UserJWT {
    let result:UserJWT = new UserJWT();
    result.token = token;
    result.expiresAt = expiresAt;
    result.loggedinAt = loggedInAt;
    result.userName = userName;
    return result;
  }
}
