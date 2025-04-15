import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {Article} from '../../app/model/article.model';
import {Chat} from '../../app/model/chat.model';
import {ChatRoom} from '../../app/model/chat-room.model';
import {ApiResponse} from '../../app/model/app.model';
import {PageData} from '../../app/model/page.model';
import {User} from '../../app/model/user.model';

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
      this.sendSuccess(response, chatRooms, undefined);
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
        this.sendSuccess(response, result, undefined);
        return;
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/chat/getChats/:chatRoomId
  //
  getChats(request: Request<{chatRoomId:string}, ApiResponse<Chat[]>, PageData, ParsedQs, Record<string, any>>,
           response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(true);

    try {

      let roomId = Number(request.params.chatRoomId);

      // Failure
      if (!this.serverDb.chatRooms.some(room => room.id == roomId)){
        this.sendDataError(response,Chat.default(),  `Chat room does not exist: ${request.params.chatRoomId}`);
        return;
      }

      let chats:Chat[] = [];
      let room = this.serverDb.chatRooms.find(room => room.id == roomId) || ChatRoom.default();
      let indexStart = (request.body.pageNumber - 1) * request.body.pageSize;
      let indexEnd = request.body.pageNumber * request.body.pageSize;

      for (let index = indexStart; index < indexEnd; index++) {

        // No More Chats
        if (index <= room.chats.length) {
          break;
        }
        else {
          chats.push(room.chats[index]);
        }
      }

      // Update Page Data
      let pageData = Object.assign({}, request.body);

      // Client may not have data for total records (yet)
      pageData.totalPages = room.chats.length / pageData.totalPages;
      pageData.totalRecords = room.chats.length;

      // Success
      this.sendSuccess(response, chats, pageData);
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
      if (!this.serverDb.chatRooms.some(room => room.id == roomId)) {
        this.sendDataError(response,Chat.default(),  `Chat room does not exist: ${request.params.chatRoomId}`);
        return;
      }

      let chatRoom = this.serverDb.chatRooms.find(room => room.id == roomId);

      // Set Id
      let chat:Chat = request.body;

      chat.id = Number(chatRoom?.chats.length);

      console.log(chat);

      // Add Chat to ChatRoom
      chatRoom?.chats.push(chat);

      // Success
      this.sendSuccess(response, chat, undefined);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
