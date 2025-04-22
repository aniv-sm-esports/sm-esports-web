import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Chat} from '../model/repository/entity/chat.model';
import {RepositoryService} from './repository.service';
import { Injectable } from '@angular/core';

export class ChatService extends RepositoryService<Chat> {

  private readonly chatRoomId:number;

  // Chat API
  //
  private readonly urlGet = "/api/chat/get/:chatRoomId";
  private readonly urlGetAll = "/api/chat/getAll/:chatRoomId";
  private readonly urlCreate = "/api/chat/create/:chatRoomId";
  private readonly urlGetRepositoryState = "/api/repository/chat/getState/:chatRoomId";
  private readonly urlPostRepositoryClientCheck = "/api/repository/chat/checkState/:chatRoomId";
  private readonly urlPostRepositoryClientState = "/api/repository/chat/setState/:chatRoomId";

  constructor(httpClient: HttpClient, chatRoomId:number) {
    super("Chat (" + chatRoomId + ")", "Chat", httpClient, Chat.default(), []);
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
