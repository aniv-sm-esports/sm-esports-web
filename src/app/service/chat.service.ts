import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EntityService} from './entity.service';
import {Chat} from '../../server/entity/model/Chat';

export class ChatService extends EntityService<Chat> {

  private readonly chatRoomId:number;

  // Chat API
  //
  private readonly urlGet = "/api/entity/chat/:chatRoomId/get";
  private readonly urlGetAll = "/api/entity/chat/:chatRoomId/getAll";
  private readonly urlCreate = "/api/entity/chat/:chatRoomId/create";
  private readonly urlGetRepositoryState = "/api/entity/chat/:chatRoomId/getState";
  private readonly urlPostRepositoryClientCheck = "/api/entity/chat/:chatRoomId/checkState";
  private readonly urlPostRepositoryClientState = "/api/entity/chat/:chatRoomId/setState";

  constructor(httpClient: HttpClient, chatRoomId:number) {
    super("Chat (" + chatRoomId + ")", "Chat", httpClient, new Chat(), []);
    this.chatRoomId = chatRoomId;
  }

  protected getEntityName(): string {
    return 'Chat';
  }

  // TODO: NOTICE PATTERN!
  protected getRepositoryKey(): string {
    return this.getEntityName() + ` (${this.chatRoomId})`;
  }

  protected getRepositoryStateUrl(): string {
    return this.urlGetRepositoryState.replace(":chatRoomId", this.chatRoomId.toString());
  }

  protected getRepositoryClientCheckUrl(): string {
    return this.urlPostRepositoryClientCheck.replace(":chatRoomId", this.chatRoomId.toString());
  }

  protected getRepositoryClientStateUrl(): string {
    return this.urlPostRepositoryClientState.replace(":chatRoomId", this.chatRoomId.toString());
  }

  protected getUrl(): string {
    return this.urlGet.replace(":chatRoomId", this.chatRoomId.toString());
  }
  protected getAllUrl(): string {
    return this.urlGetAll.replace(":chatRoomId", this.chatRoomId.toString());
  }
  protected createUrl(): string {
    return this.urlCreate.replace(":chatRoomId", this.chatRoomId.toString());
  }

/*
  postChat(chatRoomId: number, chat: Chat)  {
    return this.http.post<ApiResponse<Chat>>(this.urlPostChat.replace(':chatRoomId', chatRoomId.toString()), chat, {
      headers: this.headers
    });
  }*/
}
