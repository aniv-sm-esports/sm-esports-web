import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {Article} from '../../app/model/article.model';
import {Chat} from '../../app/model/chat.model';
import {ChatRoom} from '../../app/model/chat-room.model';
import {ApiResponse} from '../../app/model/app.model';

@Injectable({
  providedIn: 'root'
})
export class ChatController extends BaseController {

  // GET -> /api/chat/getRooms
  //
  getChatRooms(request: Request<{}, any, any, ParsedQs, Record<string, any>>,
               response: Response<any, Record<string, any>, number>) {

    this.logRequest(request);

    let message:string = '';

    try {

      let chatRooms:ChatRoom[] = [];

      this.serverDb.chatRooms.forEach((room:ChatRoom) => {
        chatRooms.push(room);
      })

        // Send during try/catch
        this.logResponseSuccess(response, chatRooms);
        return;
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }

  // GET -> /api/chat/getRoom/:chatRoomRoute
  //
  getChatRoom(request: Request<{chatRoomRoute:string}, any, any, ParsedQs, Record<string, any>>,
              response: Response<any, Record<string, any>, number>) {

    this.logRequest(request);

    let result:ChatRoom | undefined;
    let message:string = '';

    try {

      this.serverDb.chatRooms.forEach((room:ChatRoom) => {
        if (room.urlRoute == request.params.chatRoomRoute){
          result = room;
          return;
        }
      });

      // Success
      if (result) {
        this.logResponseSuccess(response, result);
        return;
      }
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }

  // GET -> /api/chat/getChats/:chatRoomId
  //
  getChats(request: Request<{chatRoomId:string}, any, any, ParsedQs, Record<string, any>>,
           response: Response<any, Record<string, any>, number>){

    this.logRequest(request);

    let message:string = '';

    try {
      let roomId = Number(request.params.chatRoomId);

      // Failure
      if (!this.serverDb.chatRooms.has(roomId)){
        message = `Chat room does not exist: ${request.params.chatRoomId}`;
        this.logResponseFail(response, message);
        return;
      }

      // Success
      this.logResponseSuccess(response, this.serverDb.chatRooms.get(roomId)?.chats);
      return;
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }

  // POST -> /api/chat/postChat/:chatRoomId
  //
  postChat(request: Request<{chatRoomId:string}, ApiResponse<Chat>, Chat, ParsedQs, Record<string, any>>,
           response: Response<ApiResponse<Chat>, Record<string, any>, number>){

    this.logRequest(request);

    if (request.body.userId < 0 ||
       !request.body.userName) {
      this.logResponseFail(response, 'User is not valid (either not logged in, or not authorized for this chat room)');
      return;
    }

    // Mark success to look for existing (true)
    let message:string = '';

    try {

      let roomId = Number(request.params.chatRoomId);

      // Failure
      if (!this.serverDb.chatRooms.has(roomId)) {
        message = `Chat room does not exist: ${request.params.chatRoomId}`;
        this.logResponseFail(response, message);
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
      this.logResponseSuccess(response, chat);
      return;
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    this.logResponseFail(response, message);
  }
}
