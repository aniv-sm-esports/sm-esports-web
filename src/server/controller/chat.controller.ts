import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {News} from '../../app/model/news.model';
import {Chat} from '../../app/model/chat.model';
import {ChatRoom} from '../../app/model/chat-room.model';

@Injectable({
  providedIn: 'root'
})
export class ChatController extends BaseController {

  // GET -> /api/news/get/:newsId
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

  // GET -> /api/news/getAll
  //
  getChats(request: Request<{chatRoomId:string}, any, any, ParsedQs, Record<string, any>>,
           response: Response<any, Record<string, any>, number>){

    this.logRequest(request);

    let message:string = '';

    try {
      let chats:Chat[] = [];
      let roomId = Number(request.params.chatRoomId);

      // Failure
      if (!this.serverDb.chatRooms.has(roomId)){
        message = `Chat room does not exist: ${request.params.chatRoomId}`;
        this.logResponseFail(response, message);
        return;
      }

      // Success
      this.logResponseSuccess(response, this.serverDb.chatRooms.get(roomId));
      return;
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }

  // POST -> /api/news/create
  //
  postChat(request: Request<{chatRoomId:string}, any, any, ParsedQs, Record<string, any>>,
           response: Response<any, Record<string, any>, number>){

    this.logRequest(request);

    // Mark success to look for existing (true)
    let message:string = '';

    try {

      let roomId = Number(request.params.chatRoomId);

      // Failure
      if (!this.serverDb.chatRooms.has(roomId)){
        message = `Chat room does not exist: ${request.params.chatRoomId}`;
        this.logResponseFail(response, message);
        return;
      }

      let chatRoom = this.serverDb.chatRooms.get(roomId);

      // Set Id
      request.body.id = this.serverDb.chatRooms.size;

      // Add Chat to ChatRoom
      chatRoom?.chats.push(request.body);

      // Success
      this.logResponseSuccess(response, request.body);
      return;
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    this.logResponseFail(response, request.body);
  }
}
