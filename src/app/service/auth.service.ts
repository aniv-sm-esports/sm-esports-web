import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiResponse, ApiResponseType} from '../model/app.model';
import {UserCredentials, UserJWT} from '../model/user-logon.model';
import {AuthHandler} from '../model/handler.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Observable (is user logged in?)
  private readonly loggedIn$: Observable<UserJWT>;
  private readonly loggedInSubject: BehaviorSubject<UserJWT> = new BehaviorSubject<UserJWT>(UserJWT.default());

  // Local Storage
  private readonly localIdKey: string = 'id_token';
  private readonly localExpiresAtKey: string = 'expires_at';

  // URL Endpoint
  private readonly urlLogon:string = '/api/login';
  private readonly urlGetSession:string = '/api/login/getSession';

  constructor(private http: HttpClient) {
    this.loggedIn$ = this.loggedInSubject.asObservable();
  }

  logon(userName:string, password:string) {
    return this.http.post<ApiResponse<UserJWT>>(this.urlLogon, UserCredentials.fromLogon(userName, password))
                    .subscribe(response =>
                    {
                        this.setSession(UserJWT.from(response?.data));
                    });
  }

  logout() {

    if (!localStorage) {
      return;
    }

    localStorage.removeItem(this.localIdKey);
    localStorage.removeItem(this.localExpiresAtKey);

    // Update Observable
    //this.loggedInSubject.next(authResult !== UserJWT.default());
  }

  private setSession(authResult:UserJWT) {

    // JWT Token Present (UserJWT !== default())
    if (!localStorage) {
      this.loggedInSubject.next(UserJWT.default());
      return;
    }

    // Set local storage
    localStorage.setItem(this.localIdKey, authResult.token);
    localStorage.setItem(this.localExpiresAtKey, JSON.stringify(authResult.expiresAt));

    // Update Observable
    this.loggedInSubject.next(authResult);
  }

  public subscribeLogonChanged(handler: AuthHandler) {
    this.loggedIn$.subscribe(value => {
      handler.onLoginChanged(value);
    });
  }

  public getLocalIdKey(): string {
    return this.localIdKey;
  }

  public getLocalExpiresAtKey(): string {
    return this.localExpiresAtKey;
  }

  // Gets UserJWT (which includes user name) from the server; and refreshes
  // client side JWT (to assure logon is still valid)
  //
  public refreshSession(){

    return this.http.get<ApiResponse<UserJWT>>(this.urlGetSession)
                    .subscribe(response =>
                    {
                      this.setSession(UserJWT.from(response?.data));
                    });
  }
}
