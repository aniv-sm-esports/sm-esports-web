import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ChatRoom} from '../model/repository/entity/chat-room.model';
import {RepositoryService} from './repository.service';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService extends RepositoryService<ChatRoom> {

  // Chat API
  //
  private readonly urlGet = "/api/chatRoom/get";
  private readonly urlGetAll = "/api/chatRoom/getAll";
  private readonly urlCreate = "/api/chatRoom/create";
  private readonly urlGetRepositoryState = "/api/repository/chatRoom/getState";
  private readonly urlPostRepositoryClientCheck = "/api/repository/chatRoom/checkState";
  private readonly urlPostRepositoryClientState = "/api/repository/chatRoom/setState";

  constructor(http: HttpClient, protected activatedRoute: ActivatedRoute) {
    super('ChatRoom', 'ChatRoom', http, ChatRoom.default(), []);
  }

  protected getEntityName(): string {
    return 'ChatRoom';
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
