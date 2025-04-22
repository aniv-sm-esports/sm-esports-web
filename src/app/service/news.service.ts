import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Article} from '../model/repository/entity/article.model';
import {RepositoryService} from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends RepositoryService<Article> {

  // ALL POST ENDPOINTS
  private readonly urlGet = "/api/news/get";
  private readonly urlGetAll = "/api/news/getAll";
  private readonly urlCreate = "/api/news/create";
  private readonly urlGetRepositoryState = "/api/repository/news/getState";
  private readonly urlPostRepositoryClientCheck = "/api/repository/news/checkState";
  private readonly urlPostRepositoryClientState = "/api/repository/news/setState";

  constructor(protected httpClient: HttpClient) {
    super('Article', 'Article', httpClient, Article.default(), []);
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
