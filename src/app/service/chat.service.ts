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

  getChatRoom(chatRoomRoute: string) {
    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.get<ApiResponse<ChatRoom>>(this.urlGetChatRoom.replace(':chatRoomRoute', chatRoomRoute), options);
  }

  getChats(chatRoomId: number) {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.get<ApiResponse<Chat[]>>(this.urlGetChats.replace(':chatRoomId', chatRoomId.toString()), options);
  }

  postChat(chatRoomId: number, chat: Chat)  {

    let httpHeaders = new HttpHeaders();
/*
    httpHeaders.append('Content-Type', 'application/json');
    httpHeaders.append('Accepts', '*');
    httpHeaders.append('Access-Control-Allow-Origin', '*');
    httpHeaders.append('X-Debug-Level', 'verbose');
    httpHeaders.append('Request Method', 'POST');

    let options = {
      headers: httpHeaders,
      responseType: 'text' as 'json',
      reportProgress: true,
      transferCache: {
        includeHeaders: ['content-type', 'accept', '*'],
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true
      }
    };
*/
    /*
        method?: string
        keepalive?: boolean
        headers?: HeadersInit
        body?: BodyInit
        redirect?: RequestRedirect
        integrity?: string
        signal?: AbortSignal
        credentials?: RequestCredentials
        mode?: RequestMode
        referrer?: string
        referrerPolicy?: ReferrerPolicy
        window?: null
        dispatcher?: Dispatcher
        duplex?: RequestDuplex
     */

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json',
      },
      body: chat,
      keepalive: false
    };

    return this.http.post<ApiResponse<Chat>>(this.urlPostChat.replace(':chatRoomId', chatRoomId.toString()), chat);
  }
}
