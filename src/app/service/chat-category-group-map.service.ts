import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ChatRoom} from '../model/repository/entity/chat-room.model';
import {RepositoryService} from './repository.service';
import {ActivatedRoute} from '@angular/router';
import {ChatCategoryGroupMap} from '../model/repository/entity/chat-category-group-map.model';

@Injectable({
  providedIn: 'root'
})
export class ChatCategoryGroupMapService extends RepositoryService<ChatCategoryGroupMap> {

  // Chat API
  //
  private readonly urlGet = "/api/chatCategoryGroupMap/get";
  private readonly urlGetAll = "/api/chatCategoryGroupMap/getAll";
  private readonly urlCreate = "/api/chatCategoryGroupMap/create";
  private readonly urlGetRepositoryState = "/api/repository/chatCategoryGroupMap/getState";
  private readonly urlPostRepositoryClientCheck = "/api/repository/chatCategoryGroupMap/checkState";
  private readonly urlPostRepositoryClientState = "/api/repository/chatCategoryGroupMap/setState";

  constructor(http: HttpClient) {
    super('ChatCategoryGroupMap', 'ChatCategoryGroupMap', http, ChatCategoryGroupMap.default(), []);
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
