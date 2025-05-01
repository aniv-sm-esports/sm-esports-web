import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {EntityService} from './entity.service';
import { Article } from '../../server/entity/model/Article';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends EntityService<Article> {

  // ALL POST ENDPOINTS
  private readonly urlGet = "/api/entity/article/get";
  private readonly urlGetAll = "/api/entity/article/getAll";
  private readonly urlCreate = "/api/entity/article/create";
  private readonly urlGetRepositoryState = "/api/entity/article/getState";
  private readonly urlPostRepositoryClientCheck = "/api/entity/article/checkState";
  private readonly urlPostRepositoryClientState = "/api/entity/article/setState";

  constructor(protected httpClient: HttpClient) {
    super('Article', 'Article', httpClient, new Article(), []);
  }

  protected getEntityName(): string {
    return 'Article';
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
