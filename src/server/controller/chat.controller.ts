import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {RepositoryController} from './repository.controller';
import {Article} from '../../app/model/repository/article.model';
import {Chat} from '../../app/model/repository/chat.model';
import {ChatRoom} from '../../app/model/repository/chat-room.model';
import {ApiData, ApiRequest, ApiResponse} from '../../app/model/service/app.model';
import {PageData} from '../../app/model/service/page.model';
import {User} from '../../app/model/repository/user.model';
import {Repository} from '../../app/model/repository/repository.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {SearchModel} from '../../app/model/service/search.model';

export class ChatController extends RepositoryController<Chat> {

  private repository:Repository<Chat> = Repository.default<Chat>();

  constructor(private readonly chatRoomId:number, serverDb: DataModel, authService: AuthService) {
    super(serverDb, authService);
    this.initialize();
  }

  initialize() {
    let chatRoom = this.serverDb.chatRooms.getFirst(SearchModel.fromMap<ChatRoom>({ "id": this.chatRoomId.toString() }));

    if (!!chatRoom) {
      this.repository = new Repository<Chat>(`Chat Repository(${chatRoom.id})`);
    }
  }

  // POST -> /api/chat/getChats/:chatRoomId
  //
  getChats(request: Request<{chatRoomId:string}, ApiResponse<Chat>, ApiRequest<Chat>, ParsedQs, Record<string, any>>,
           response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(true);

    try {

      let roomId = Number(request.params.chatRoomId);

      // Failure
      if (this.chatRoomId !== roomId){
        this.sendDataError(response, 'Incorrect chat room id. Please resend with the proper chat room!');
        return;
      }

      // Data
      let pageData = request.body.pageData || PageData.firstPage(50);
      let chats:Chat[] = this.repository.getPage(pageData) || [];
      let apiData = ApiData.fromSet(chats);

      // Success
      this.sendSuccess(response, apiData, pageData);
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/chat/postChat/:chatRoomId
  //
  postChat(request: Request<{chatRoomId:string}, ApiResponse<Chat>, ApiRequest<Chat>, ParsedQs, Record<string, any>>,
           response: Response<ApiResponse<Chat>, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(true);

    // Logon Required
    if (this.requestUser.isDefault()) {
      console.log(this.requestUser);
      this.sendDataError(response, 'User is not valid (either not logged in, or not authorized for this chat room)');
      return;
    }

    // Chat Data Required
    if (!request.body.data){
      this.sendDataError(response, 'Chat message invalid');
      return;
    }

    try {

      let roomId = Number(request.params.chatRoomId);

      // Failure
      if (this.chatRoomId !== roomId) {
        this.sendDataError(response, 'Incorrect chat room id. Please resend with the proper chat room!');
        return;
      }

      // Set Id
      let chat = Object.assign({}, request.body.data) as Chat;

      chat.id = Number(this.repository.getSize());

      // Add Chat to ChatRoom
      this.repository.append(chat);

      let apiData = ApiData.fromSingle(chat);

      // Success
      this.sendSuccess(response, apiData, undefined);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
