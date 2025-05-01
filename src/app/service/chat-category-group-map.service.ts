import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EntityService} from './entity.service';
import {ChatCategoryGroupMap} from '../../server/entity/model/ChatCategoryGroupMap';

@Injectable({
  providedIn: 'root'
})
export class ChatCategoryGroupMapService extends EntityService<ChatCategoryGroupMap> {

  // Chat API
  //
  private readonly urlGet = "/api/entity/chatCategoryGroupMap/get";
  private readonly urlGetAll = "/api/entity/chatCategoryGroupMap/getAll";
  private readonly urlCreate = "/api/entity/chatCategoryGroupMap/create";
  private readonly urlGetRepositoryState = "/api/entity/chatCategoryGroupMap/getState";
  private readonly urlPostRepositoryClientCheck = "/api/entity/chatCategoryGroupMap/checkState";
  private readonly urlPostRepositoryClientState = "/api/entity/chatCategoryGroupMap/setState";

  constructor(http: HttpClient) {
    super('ChatCategoryGroupMap', 'ChatCategoryGroupMap', http, new ChatCategoryGroupMap(), []);
  }

  protected getEntityName(): string {
    return 'ChatCategoryGroupMap';
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
