import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../model/repository/user.model';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {ApiRequest, ApiResponse, ApiResponseType} from '../model/service/app.model';
import {UserCreation} from '../model/view/user-creation.model';
import {Chat} from '../model/repository/chat.model';
import {PageData} from '../model/service/page.model';
import {SearchModel} from '../model/service/search.model';
import {RepositoryState} from '../model/repository/repository-state.model';
import {Repository} from '../model/repository/repository.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http: HttpClient;
  private readonly repository:Repository<User>;

  // Users -> Post -> Create User
  urlGet = "/api/users/get/:userName";
  urlGetPage = "/api/users/getPage";
  urlExists = "/api/auth/exists/:userName";
  urlCreate = "/api/auth/create";

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*',
  });

  // Search (for People-* components)
  //
  private userSearch: SearchModel<User> = SearchModel.default();
  private userSearchChangeBehavior = new BehaviorSubject<SearchModel<User>>(this.userSearch);
  private userSearchChanged$ = this.userSearchChangeBehavior.asObservable();

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
    this.repository = new Repository<User>('Client User Repository');
    this.userSearch = new SearchModel<User>();

    this.repository.repositoryChange$.subscribe(changes => {

    });
  }

  public onSearchChanged() {
    return this.userSearchChanged$;
  }

  public updateSearch(searchField: string, searchInput: any) {
    this.userSearch.set(searchField, searchInput);
    this.userSearchChangeBehavior.next(this.userSearch);
  }

  public resetSearch() {
    this.userSearch = SearchModel.default<User>();
  }

  public getUser(userName:string) {

    // Local Promise
    if (this.repository.any(x => x.name === userName)) {
      return new Promise<User>((resolve, reject) => {
        resolve(this.repository.first(x => x.name === userName) || User.default());
      });
    }

    // Remove Promise
    else {
      return new Promise<User>((resolve, reject) => {

        this.getUserRemote(userName).subscribe(response => {

          if (response && response.response == ApiResponseType.Success && response.apiData.data) {

            // Update
            if (!this.repository.has(response.apiData.data.id)){
              this.repository.append(response.apiData.data);
            }
            else {
              this.repository.set(response.apiData.data);
            }

            // Resolve
            resolve(response.apiData.data);
          }
          else {

            // Reject
            reject(undefined);
          }
        });
      });
    }
  }

  public getUserPage(pageData:PageData) {

    // Local Promise (TODO!)
    /*
    if (this.repository.any(x => x.name === userName)) {
      return new Promise<User>((resolve, reject) => {
        return this.repository.first(x => x.name === userName);
      });
    }
    */

    // Remove Promise

      return new Promise<User[]>((resolve, reject) => {

        this.getPageRemote(pageData, this.userSearch).subscribe(response => {

          if (response && response.response == ApiResponseType.Success && response.apiData.dataSet) {
            this.repository.update(response.apiData.dataSet, response.repositoryState.lastRepositoryChange);

            // Resolve
            resolve(response.apiData.dataSet);
          }
          else {

            // Reject
            reject([]);
          }
        });
      });
  }

  private getUserRemote(userName: string) {
    return this.http.get<ApiResponse<User>>(this.urlGet.replace(':userName', userName));
  }

  private getPageRemote(pageData: PageData, searchModel:SearchModel<User>) {
    return this.http
               .post<ApiResponse<User>>(this.urlGetPage, ApiRequest.paged<User>(pageData, new RepositoryState<User>(0, searchModel)), {headers: this.headers});
  }

  createUser(userCreation: UserCreation) : Observable<UserCreation> {
    return this.http.post<UserCreation>(this.urlCreate, userCreation, {headers: this.headers});
  }
}
