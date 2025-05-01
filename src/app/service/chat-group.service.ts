import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EntityService} from './entity.service';
import {ChatGroup} from '../../server/entity/model/ChatGroup';

@Injectable({
  providedIn: 'root'
})
export class ChatGroupService extends EntityService<ChatGroup> {

  // Chat API
  //
  private readonly urlGet = "/api/entity/chatGroup/get";
  private readonly urlGetAll = "/api/entity/chatGroup/getAll";
  private readonly urlCreate = "/api/entity/chatGroup/create";
  private readonly urlGetRepositoryState = "/api/entity/chatGroup/getState";
  private readonly urlPostRepositoryClientCheck = "/api/entity/chatGroup/checkState";
  private readonly urlPostRepositoryClientState = "/api/entity/chatGroup/setState";

  constructor(http: HttpClient) {
    super('ChatGroup', 'ChatGroup', http, new ChatGroup(), []);
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
