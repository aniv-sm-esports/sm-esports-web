import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {GetUsersResponse, IGetUsersResponse, IUser, IUserResponse, User, UserResponse} from '../model/user.model';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http: HttpClient;

  // Users -> Post -> Create User
  urlGet = "/users/:userName";
  urlCreate = "/users/create";
  urlGetAll = "/users/getAll";
  urlHasDuplicate = "/users/hasDuplicate";

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }

  async getUser(userName: string) {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');
    httpHeaders.append('accept', '*');

    let options = {
      headers: httpHeaders,
      withCredentials: true,
      transferCache: {
        includeHeaders: ['content-type', 'accept', '*'],
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true
      }
    };

    return await firstValueFrom<User>(this.http.get<User>(this.urlGet + '/' + userName, options));
  }

  async hasDuplicateUser(userName: string) {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');
    httpHeaders.append('accept', '*');
    httpHeaders.append('Access-Control-Allow-Origin', '*');

    let options = {
      headers: httpHeaders,
      withCredentials: true,
      transferCache: {
        includeHeaders: ['content-type', 'accept', '*'],
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true
      }
    };

    return await firstValueFrom<boolean>(this.http.get<boolean>(this.urlHasDuplicate + '/' + userName, options));

    /*
    return await fetch(this.urlHasDuplicate + '/' + userName, {
      method: 'GET',
      headers: {
        'conetnt-type': 'application/json',
        'accept': '*'
      }
    });
    */
  }

  createUser(user: User) : Observable<UserResponse> {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('Content-Type', 'application/json');
    httpHeaders.append('Accept', '*');
    httpHeaders.append('Access-Control-Allow-Origin', '*');

    let options = {
      headers: httpHeaders,
      params: {
        userName: 'ATestUser'
      },
      withCredentials: true,
      transferCache: {
        includeHeaders: ['content-type', 'accept', '*'],
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true
      }
    };

    return this.http.get<UserResponse>(this.urlCreate + '/' + user.name, options);
  }

  getAllUsers(): Observable<GetUsersResponse> {

     let httpHeaders = new HttpHeaders();

     httpHeaders.append('content-type', 'application/json');
     httpHeaders.append('accept', '*');
     httpHeaders.append('Access-Control-Allow-Origin', '*');

     let options = {
       headers: httpHeaders,
       withCredentials: true,
       transferCache: {
         includeHeaders: ['content-type', 'accept', '*'],
         includePostRequests: true,
         includeRequestsWithAuthHeaders: true
       }
     };

    return this.http.get<GetUsersResponse>(this.urlGetAll, options);
  }
}
