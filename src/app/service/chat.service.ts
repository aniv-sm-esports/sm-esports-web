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
  urlGetChatRoom = "/api/chat/getRoom/:chatRoomRoute";
  urlGetChats = "/api/chat/getChats/:chatRoomId";
  urlPostChat = "/api/chat/postChat/:chatRoomId";

  private readonly headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }

  getChatRooms() {
    return this.http.get<ApiResponse<ChatRoom[]>>(this.urlGetChatRooms);
  }

  getChatRoom(chatRoomRoute: string) {
    return this.http.get<ApiResponse<ChatRoom>>(this.urlGetChatRoom.replace(':chatRoomRoute', chatRoomRoute), {
      headers: this.headers
    });
  }

  getChats(chatRoomId: number) {
    return this.http.get<ApiResponse<Chat[]>>(this.urlGetChats.replace(':chatRoomId', chatRoomId.toString()), {
      headers: this.headers
    });
  }

  postChat(chatRoomId: number, chat: Chat)  {
    return this.http.post<ApiResponse<Chat>>(this.urlPostChat.replace(':chatRoomId', chatRoomId.toString()), chat, {
      headers: this.headers
    });
  }
}
