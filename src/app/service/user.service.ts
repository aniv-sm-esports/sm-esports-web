import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../model/repository/user.model';
import {firstValueFrom, Observable} from 'rxjs';
import {ApiRequest, ApiResponse} from '../model/service/app.model';
import {UserCreation} from '../model/view/user-creation.model';
import {Chat} from '../model/repository/chat.model';
import {PageData} from '../model/service/page.model';
import {SearchModel} from '../model/service/search.model';
import {RepositoryState} from '../model/repository/repository-state.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http: HttpClient;

  // Users -> Post -> Create User
  urlGet = "/api/users/get/:userName";
  urlGetPage = "/api/users/getPage";
  urlExists = "/api/auth/exists/:userName";
  urlCreate = "/api/auth/create";

  private readonly headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }

  getUser(userName: string) {
    return this.http.get<ApiResponse<User>>(this.urlGet.replace(':userName', userName));
  }

  getPage(pageData: PageData, searchModel:SearchModel<User>) {
    return this.http.post<ApiResponse<User>>(this.urlGetPage, ApiRequest.paged<User>(pageData, new RepositoryState<User>(0, searchModel)), {
      headers: this.headers
    });
  }

  userExists(userName: string) {
    return this.http.get<User>(this.urlExists.replace(':userName', userName));
  }

  createUser(userCreation: UserCreation) : Observable<UserCreation> {
    return this.http.post<UserCreation>(this.urlCreate, userCreation, {
      headers: this.headers
    });
  }
}
