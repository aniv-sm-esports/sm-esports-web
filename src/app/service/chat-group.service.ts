import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RepositoryService} from './repository.service';
import {ActivatedRoute} from '@angular/router';
import {ChatGroup} from '../model/repository/entity/chat-group.model';

@Injectable({
  providedIn: 'root'
})
export class ChatGroupService extends RepositoryService<ChatGroup> {

  // Chat API
  //
  private readonly urlGet = "/api/chatGroup/get";
  private readonly urlGetAll = "/api/chatGroup/getAll";
  private readonly urlCreate = "/api/chatGroup/create";
  private readonly urlGetRepositoryState = "/api/repository/chatGroup/getState";
  private readonly urlPostRepositoryClientCheck = "/api/repository/chatGroup/checkState";
  private readonly urlPostRepositoryClientState = "/api/repository/chatGroup/setState";

  constructor(http: HttpClient) {
    super('ChatGroup', 'ChatGroup', http, ChatGroup.default(), []);
  }

  protected getEntityName(): string {
    return 'ChatGroup';
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
