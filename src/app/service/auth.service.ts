import moment from "moment";
import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {UserLogon} from '../model/user-logon.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {Size} from '../model/app.model';

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

  // URL Endpoint
  private readonly urlLogon:string = '/api/login';

  constructor(private http: HttpClient) {
    this.loggedIn$ = this.loggedInSubject.asObservable();
  }

  logon(userName:string, password:string) {
    return this.http.post<UserLogon>(this.urlLogon, UserLogon.fromLogon(userName, password))
                    .subscribe(res => this.setSession);
  }

  private setSession(authResult:UserLogon) {

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
