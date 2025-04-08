import {UserJWT} from './user-logon.model';

export interface AuthHandler {
  onLoginChanged: (value: UserJWT) => void  //defining the callback
}
