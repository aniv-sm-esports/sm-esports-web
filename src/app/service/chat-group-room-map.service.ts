import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ChatRoom} from '../model/repository/entity/chat-room.model';
import {RepositoryService} from './repository.service';
import {ActivatedRoute} from '@angular/router';
import {ChatGroupRoomMap} from '../model/repository/entity/chat-group-room-map.model';

@Injectable({
  providedIn: 'root'
})
export class ChatGroupRoomMapService extends RepositoryService<ChatGroupRoomMap> {

  // Chat API
  //
  private readonly urlGet = "/api/chatGroupRoomMap/get";
  private readonly urlGetAll = "/api/chatGroupRoomMap/getAll";
  private readonly urlCreate = "/api/chatGroupRoomMap/create";
  private readonly urlGetRepositoryState = "/api/repository/chatGroupRoomMap/getState";
  private readonly urlPostRepositoryClientCheck = "/api/repository/chatGroupRoomMap/checkState";
  private readonly urlPostRepositoryClientState = "/api/repository/chatGroupRoomMap/setState";

  constructor(http: HttpClient) {
    super('ChatGroupRoomMap', 'ChatGroupRoomMap', http, ChatGroupRoomMap.default(), []);
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
