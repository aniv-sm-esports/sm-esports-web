import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Chat} from '../model/chat.model';
import {ApiResponse} from '../model/app.model';
import {ChatRoom} from '../model/chat-room.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly http: HttpClient;

  // Chat API
  //
  urlGetChatRooms = "/api/chat/getRooms";
  urlGetChats = "/api/chat/getChats/:chatRoomId";
  urlPostChat = "/api/chat/:chatRoomId";

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }

  getChatRooms() {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.get<ApiResponse<ChatRoom[]>>(this.urlGetChatRooms, options);
  }

  getChats(chatRoomId: number) {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.get<ApiResponse<Chat[]>>(this.urlGetChats.replace(':chatRoomId', chatRoomId.toString()), options);
  }

  postChat(chatRoomId: number, chat: Chat) {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('Content-Type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.post<ApiResponse<Chat>>(this.urlPostChat.replace(':chatRoomId', chatRoomId.toString()), chat, options);
  }
}
