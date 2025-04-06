import moment from "moment";
import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {UserLogon} from '../model/user-logon.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Local Storage
  private readonly localIdKey: string = 'id_token';
  private readonly localExpiresAtKey: string = 'expires_at';

  // URL Endpoint
  private readonly urlLogon:string = '/api/login';

  constructor(private http: HttpClient) {

  }

  logon(userName:string, password:string) {
    return this.http.post<UserLogon>(this.urlLogon, UserLogon.fromLogon(userName, password))
                    .subscribe(res => this.setSession);
  }

  private setSession(authResult:UserLogon) {
    localStorage.setItem(this.localIdKey, authResult.token);
    localStorage.setItem(this.localExpiresAtKey, JSON.stringify(authResult.expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem(this.localIdKey);
    localStorage.removeItem(this.localExpiresAtKey);
  }

  public getLocalIdKey(): string {
    return this.localIdKey;
  }
  public getLocalExpiresAtKey(): string {
    return this.localExpiresAtKey;
  }

  public isLoggedIn() {

    if (!localStorage.getItem(this.localIdKey) ||
        !localStorage.getItem(this.localExpiresAtKey)) {
      return false;
    }

    let expiration = localStorage.getItem(this.localExpiresAtKey) || '';
    let expiresAt = JSON.parse(expiration);

    return moment().isBefore(moment(expiresAt));
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
