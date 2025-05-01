import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EntityService} from './entity.service';
import {ChatGroupRoomMap} from '../../server/entity/model/ChatGroupRoomMap';

@Injectable({
  providedIn: 'root'
})
export class ChatGroupRoomMapService extends EntityService<ChatGroupRoomMap> {

  // Chat API
  //
  private readonly urlGet = "/api/entity/chatGroupRoomMap/get";
  private readonly urlGetAll = "/api/entity/chatGroupRoomMap/getAll";
  private readonly urlCreate = "/api/entity/chatGroupRoomMap/create";
  private readonly urlGetRepositoryState = "/api/entity/chatGroupRoomMap/getState";
  private readonly urlPostRepositoryClientCheck = "/api/entity/chatGroupRoomMap/checkState";
  private readonly urlPostRepositoryClientState = "/api/entity/chatGroupRoomMap/setState";

  constructor(http: HttpClient) {
    super('ChatGroupRoomMap', 'ChatGroupRoomMap', http, new ChatGroupRoomMap(), []);
  }

  protected getEntityName(): string {
    return 'ChatGroupRoomMap';
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
