import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../model/user.model';
import {firstValueFrom, Observable} from 'rxjs';
import {ApiResponse} from '../model/app.model';
import {UserCreation} from '../model/user-creation.model';
import {Chat} from '../model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http: HttpClient;

  // Users -> Post -> Create User
  urlGet = "/api/users/get/:userName";
  urlGetAll = "/api/users/getAll";
  urlExists = "/api/users/exists/:userName";
  urlCreate = "/api/users/create";

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }

  getUser(userName: string) {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.get<ApiResponse<User>>(this.urlGet.replace(':userName', userName), options);
  }

  getAll() {
    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.get<ApiResponse<User[]>>(this.urlGetAll, options);
  }

  userExists(userName: string) {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders,
      withCredentials: true,
      transferCache: {
        includeHeaders: ['content-type', 'accept', '*'],
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true
      }
    };

    return this.http.get<ApiResponse<User>>(this.urlExists.replace(':userName', userName), options);
  }

  createUser(userCreation: UserCreation) : Observable<ApiResponse<UserCreation>> {

    return this.http.post<ApiResponse<UserCreation>>(this.urlCreate, userCreation);
  }
}
