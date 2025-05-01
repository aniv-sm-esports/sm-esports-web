import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EntityService} from './entity.service';
import {ChatCategory} from '../../server/entity/model/ChatCategory';

@Injectable({
  providedIn: 'root'
})
export class ChatCategoryService extends EntityService<ChatCategory> {

  // Chat API
  //
  private readonly urlGet = "/api/entity/chatCategory/get";
  private readonly urlGetAll = "/api/entity/chatCategory/getAll";
  private readonly urlCreate = "/api/entity/chatCategory/create";
  private readonly urlGetRepositoryState = "/api/entity/chatCategory/getState";
  private readonly urlPostRepositoryClientCheck = "/api/entity/chatCategory/checkState";
  private readonly urlPostRepositoryClientState = "/api/entity/chatCategory/setState";

  constructor(http: HttpClient) {
    super('ChatCategory', 'ChatCategory', http, new ChatCategory(), []);
  }

  protected getEntityName(): string {
    return 'ChatCategory';
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
