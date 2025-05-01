import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {EntityService} from './entity.service';
import {User} from '../../server/entity/model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService extends EntityService<User> {

  // ALL POST ENDPOINTS
  private readonly urlGet = "/api/entity/user/get";
  private readonly urlGetAll = "/api/entity/user/getAll";
  private readonly urlCreate = "/api/entity/user/create";
  private readonly urlGetRepositoryState = "/api/entity/user/getState";
  private readonly urlPostRepositoryClientCheck = "/api/entity/user/checkState";
  private readonly urlPostRepositoryClientState = "/api/entity/user/setState";

  constructor(protected httpClient: HttpClient) {
    super('User', 'User', httpClient, new User(), []);
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
