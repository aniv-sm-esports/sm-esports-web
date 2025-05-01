import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EntityService} from './entity.service';
import {ActivatedRoute} from '@angular/router';
import {ChatRoom} from '../../server/entity/model/ChatRoom';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService extends EntityService<ChatRoom> {

  // Chat API
  //
  private readonly urlGet = "/api/entity/chatRoom/get";
  private readonly urlGetAll = "/api/entity/chatRoom/getAll";
  private readonly urlCreate = "/api/entity/chatRoom/create";
  private readonly urlGetRepositoryState = "/api/entity/chatRoom/getState";
  private readonly urlPostRepositoryClientCheck = "/api/entity/chatRoom/checkState";
  private readonly urlPostRepositoryClientState = "/api/entity/chatRoom/setState";

  constructor(http: HttpClient, protected activatedRoute: ActivatedRoute) {
    super('ChatRoom', 'ChatRoom', http, new ChatRoom(), []);
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
