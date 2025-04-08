import moment from "moment";
import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, Observable} from 'rxjs';
import {Size} from '../model/app.model';
import {UserCredentials, UserJWT} from '../model/user-logon.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Observable (is user logged in?)
  private readonly loggedIn$: Observable<boolean>;
  private readonly loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Local Storage
  private readonly localIdKey: string = 'id_token';
  private readonly localExpiresAtKey: string = 'expires_at';

  // Stored UserLogon
  private userLogon:UserJWT | undefined;

  // URL Endpoint
  private readonly urlLogon:string = '/api/login';

  constructor(private http: HttpClient) {
    this.loggedIn$ = this.loggedInSubject.asObservable();
  }

  logon(userName:string, password:string) {
    return this.http.post<UserJWT>(this.urlLogon, UserCredentials.fromLogon(userName, password))
                    .subscribe(res => this.setSession(res));
  }

  private setSession(authResult:UserJWT) {

    // Save UserLogon
    this.userLogon = authResult;

    if (!localStorage) {
      this.loggedInSubject.next(this.isLoggedIn());
    }

    // Set local storage
    localStorage.setItem(this.localIdKey, authResult.token);
    localStorage.setItem(this.localExpiresAtKey, JSON.stringify(authResult.expiresAt.valueOf()));

    // Update Observable
    this.loggedInSubject.next(this.isLoggedIn());
  }

  logout() {

    if (!localStorage) {
      return;
    }

    localStorage.removeItem(this.localIdKey);
    localStorage.removeItem(this.localExpiresAtKey);

    // Update Observable
    this.loggedInSubject.next(this.isLoggedIn());
  }

  public subscribeLogonChanged(callback: Function) {
    this.loggedIn$.subscribe(value => {
      callback(value);
    });
  }

  public getLocalIdKey(): string {
    return this.localIdKey;
  }

  public getLocalExpiresAtKey(): string {
    return this.localExpiresAtKey;
  }

  public getLastLogon(){
    return this.userLogon;
  }

  public isLoggedIn() {

    if (!localStorage) {
      return false;
    }

    if (!localStorage.getItem(this.localIdKey) ||
        !localStorage.getItem(this.localExpiresAtKey)) {
      return false;
    }

    let expiration = localStorage.getItem(this.localExpiresAtKey) || '';
    let expiresAt = JSON.parse(expiration);

    return moment().isBefore(moment(expiresAt));
  }
}
