import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {RepositoryController} from './repository.controller';
import {ChatRoom} from '../../app/model/repository/chat-room.model';
import {ApiData, ApiRequest, ApiResponse} from '../../app/model/service/app.model';
import {PageData} from '../../app/model/service/page.model';
import {Repository} from '../../app/model/repository/repository.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';

export class ChatRoomController extends RepositoryController<ChatRoom> {

  private repository:Repository<ChatRoom> = Repository.default<ChatRoom>();

  constructor(serverDb: DataModel, authService: AuthService) {
    super(serverDb, authService);
    this.initialize();
  }

  initialize() {
    this.repository = this.serverDb.chatRooms;
  }

  // GET -> /api/chat/getRooms
  //
  getChatRooms(request: Request<{}, ApiResponse<ChatRoom>, ApiRequest<ChatRoom>, ParsedQs, Record<string, any>>,
               response: Response<ApiResponse<ChatRoom>, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      let chatRooms:ChatRoom[] = [];

      // REMOVE CHATS FROM ROOMS! (These may require permissions)
      this.repository.getAll().forEach((room:ChatRoom) => {

        let roomExceptChats = Object.assign({}, room);
        roomExceptChats.chats = [];

        chatRooms.push(roomExceptChats);
      });

      let apiData = ApiData.fromSet<ChatRoom>(chatRooms);
      let pageData = PageData.fromResponse(1, chatRooms.length);

      // Success
      this.sendSuccess(response, apiData, pageData);
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // GET -> /api/chat/getRoom/:chatRoomRoute
  //
  getChatRoom(request: Request<{chatRoomRoute:string}, ApiResponse<ChatRoom>, ApiRequest<ChatRoom>, ParsedQs, Record<string, any>>,
              response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    let result:ChatRoom | undefined;

    try {

      // Must retrieve the chat room and remove the chat data
      this.repository.getAll().forEach((room:ChatRoom) => {
        if (room.urlRoute == request.params.chatRoomRoute) {
          result = Object.assign({}, room);
          result.chats = [];
          return;
        }
      });

      // Success
      if (result) {
        let apiData = ApiData.fromSingle<ChatRoom>(result);
        let pageData = PageData.fromResponse(1, 1);

        this.sendSuccess(response, apiData, pageData);
        return;
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
