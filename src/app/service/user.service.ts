import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../model/repository/entity/user.model';
import {RepositoryService} from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends RepositoryService<User> {

  // ALL POST ENDPOINTS
  private readonly urlGet = "/api/user/get";
  private readonly urlGetAll = "/api/user/getAll";
  private readonly urlCreate = "/api/user/create";
  private readonly urlGetRepositoryState = "/api/repository/user/getState";
  private readonly urlPostRepositoryClientCheck = "/api/repository/user/checkState";
  private readonly urlPostRepositoryClientState = "/api/repository/user/setState";

  constructor(protected httpClient: HttpClient) {
    super('User', 'User', httpClient, User.default(), []);
  }

  protected getEntityName(): string {
    return 'User';
  }

  // TODO
  protected getRepositoryKey(): string {
    return this.getEntityName();
  }

  protected getRepositoryStateUrl(): string {
    return this.urlGetRepositoryState;
  }
  protected getRepositoryClientCheckUrl(): string {
    return this.urlPostRepositoryClientCheck;
  }

  protected getRepositoryClientStateUrl(): string {
    return this.urlPostRepositoryClientState;
  }
  protected getUrl(): string {
    return this.urlGet;
  }
  protected getAllUrl(): string {
    return this.urlGetAll;
  }
  protected createUrl(): string {
    return this.urlCreate;
  }
}
