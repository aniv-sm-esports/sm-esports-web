import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {Article} from '../../app/model/article.model';
import {Chat} from '../../app/model/chat.model';
import {ChatRoom} from '../../app/model/chat-room.model';
import {ApiResponse} from '../../app/model/app.model';

export class ChatController extends BaseController {

  // GET -> /api/chat/getRooms
  //
  getChatRooms(request: Request<{}, any, any, ParsedQs, Record<string, any>>,
               response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      let chatRooms:ChatRoom[] = [];

      // REMOVE CHATS FROM ROOMS! (These may require permissions)
      this.serverDb.chatRooms.forEach((room:ChatRoom) => {

        let roomExceptChats = Object.assign({}, room);
        roomExceptChats.chats = [];

        chatRooms.push(roomExceptChats);
      });

      // Success
      this.sendSuccess(response, chatRooms);
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // GET -> /api/chat/getRoom/:chatRoomRoute
  //
  getChatRoom(request: Request<{chatRoomRoute:string}, any, any, ParsedQs, Record<string, any>>,
              response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    let result:ChatRoom | undefined;

    try {

      // Must retrieve the chat room and remove the chat data
      this.serverDb.chatRooms.forEach((room:ChatRoom) => {
        if (room.urlRoute == request.params.chatRoomRoute) {
          result = Object.assign({}, room);
          result.chats = [];
          return;
        }
      });

      // Success
      if (result) {
        this.sendSuccess(response, result);
        return;
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // GET -> /api/chat/getChats/:chatRoomId
  //
  getChats(request: Request<{chatRoomId:string}, any, any, ParsedQs, Record<string, any>>,
           response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(true);

    try {
      let roomId = Number(request.params.chatRoomId);

      // Failure
      if (!this.serverDb.chatRooms.has(roomId)){
        this.sendDataError(response,Chat.default(),  `Chat room does not exist: ${request.params.chatRoomId}`);
        return;
      }

      // Success
      this.sendSuccess(response, this.serverDb.chatRooms.get(roomId)?.chats);
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/chat/postChat/:chatRoomId
  //
  postChat(request: Request<{chatRoomId:string}, ApiResponse<Chat>, Chat, ParsedQs, Record<string, any>>,
           response: Response<ApiResponse<Chat>, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(true);

    if (this.requestUser.isDefault()) {
      console.log(this.requestUser);
      this.sendDataError(response, Chat.default(), 'User is not valid (either not logged in, or not authorized for this chat room)');
      return;
    }

    try {

      let roomId = Number(request.params.chatRoomId);

      // Failure
      if (!this.serverDb.chatRooms.has(roomId)) {
        this.sendDataError(response,Chat.default(),  `Chat room does not exist: ${request.params.chatRoomId}`);
        return;
      }

      let chatRoom = this.serverDb.chatRooms.get(roomId);

      // Set Id
      let chat:Chat = request.body;

      chat.id = Number(chatRoom?.chats.length);

      console.log(chat);

      // Add Chat to ChatRoom
      chatRoom?.chats.push(chat);

      // Success
      this.sendSuccess(response, chat);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
