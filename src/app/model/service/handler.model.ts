import {UserJWT} from './user-logon.model';
import {Moment} from 'moment';

export interface AuthHandler {
  onLoginChanged: (value: UserJWT) => void  //defining the callback
}

export interface TimeHandler {
  onReady: (value: Moment) => void  //defining the callback
}

export type Predicate<T> = (item: T) => boolean;
