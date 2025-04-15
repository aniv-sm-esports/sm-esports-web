import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../model/user.model';
import {firstValueFrom, Observable} from 'rxjs';
import {ApiResponse} from '../model/app.model';
import {UserCreation} from '../model/user-creation.model';
import {Chat} from '../model/chat.model';
import {PageData} from '../model/page.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http: HttpClient;

  // Users -> Post -> Create User
  urlGet = "/api/users/get/:userName";
  urlGetPage = "/api/users/getPage";
  urlExists = "/api/users/exists/:userName";
  urlCreate = "/api/users/create";

  private readonly headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }

  getUser(userName: string) {
    return this.http.get<ApiResponse<User>>(this.urlGet.replace(':userName', userName));
  }

  getPage(pageData: PageData) {
    return this.http.post<ApiResponse<User[]>>(this.urlGetPage, pageData, {
      headers: this.headers
    });
  }

  userExists(userName: string) {
    return this.http.get<ApiResponse<User>>(this.urlExists.replace(':userName', userName));
  }

  createUser(userCreation: UserCreation) : Observable<ApiResponse<UserCreation>> {
    return this.http.post<ApiResponse<UserCreation>>(this.urlCreate, userCreation, {
      headers: this.headers
    });
  }
}
