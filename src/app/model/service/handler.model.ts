import {Moment} from 'moment';
import {UserJWT} from '../../../server/entity/model/UserJWT';

export interface AuthHandler {
  onLoginChanged: (value: UserJWT) => void  //defining the callback
}

export interface TimeHandler {
  onReady: (value: Moment) => void  //defining the callback
}

export type Predicate<T> = (item: T) => boolean;
export type Callback<T> = (item: T) => void;
export type Selector<TResult, T> = (item: T) => TResult;
