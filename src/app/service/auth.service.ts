import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthHandler} from '../model/service/handler.model'
import { UserCreation } from '../model/view/user-creation.model';
import { UserJWT } from '../../server/entity/model/UserJWT';
import { UserCredential } from '../../server/entity/model/UserCredential';
import { ServerExpressResponse } from '../../server/server.definitions';
import {ServerRequest} from '../../server/model/server-request.model';
import {ServerResponse} from '../../server/model/server-response.model';
import {PageData} from '../../server/model/page-data.model';
import {ServerData} from '../../server/model/server-entity-data';
import {UserCredentialClientDTO} from '../model/client-dto/UserCredentialClientDTO';

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
  private readonly urlLogon:string = '/api/auth/login';
  private readonly urlCreate:string = '/api/auth/create';
  private readonly urlGetSession:string = '/api/auth/getSession';

  constructor(private http: HttpClient) {
    this.loggedIn$ = this.loggedInSubject.asObservable();
  }

  logon(userName:string, password:string) {
    return this.http.post<ServerResponse<UserJWT>>(this.urlLogon, new ServerRequest<UserCredentialClientDTO>(new ServerData([UserCredentialClientDTO.fromLogon(userName, password)]), PageData.default()))
                    .subscribe(response => {
                        this.setSession(response.responseData.data[0]);
                    });
  }

  createUser(userCreation:UserCreation) {
    return this.http.post<ServerResponse<UserCreation>>(this.urlCreate, new ServerRequest<UserCreation>(new ServerData([userCreation]), PageData.default()));
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
    localStorage.setItem(this.localIdKey, authResult.Token);
    localStorage.setItem(this.localExpiresAtKey, JSON.stringify(authResult.ExpirationTime));

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

    return this.http.post<ServerResponse<UserJWT>>(this.urlGetSession, new ServerRequest<UserJWT>(ServerData.default(), PageData.default()))
                    .subscribe(response =>
                    {
                      this.setSession(response.responseData.data[0]);
                    });
  }
}
