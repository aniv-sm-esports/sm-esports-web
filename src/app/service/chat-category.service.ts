import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ChatRoom} from '../model/repository/entity/chat-room.model';
import {RepositoryService} from './repository.service';
import {ActivatedRoute} from '@angular/router';
import {ChatCategory} from '../model/repository/entity/chat-category.model';

@Injectable({
  providedIn: 'root'
})
export class ChatCategoryService extends RepositoryService<ChatCategory> {

  // Chat API
  //
  private readonly urlGet = "/api/chatCategory/get";
  private readonly urlGetAll = "/api/chatCategory/getAll";
  private readonly urlCreate = "/api/chatCategory/create";
  private readonly urlGetRepositoryState = "/api/repository/chatCategory/getState";
  private readonly urlPostRepositoryClientCheck = "/api/repository/chatCategory/checkState";
  private readonly urlPostRepositoryClientState = "/api/repository/chatCategory/setState";

  constructor(http: HttpClient) {
    super('ChatCategory', 'ChatCategory', http, ChatCategory.default(), []);
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
