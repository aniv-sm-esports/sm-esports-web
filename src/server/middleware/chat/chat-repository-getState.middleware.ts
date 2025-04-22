import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {ChatRoomControllerName} from '../../service/controller-const';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import {ChatRoomController} from '../../controller/chat-room.controller';
import {ChatController} from '../../controller/chat.controller';
import { Chat } from '../../../app/model/repository/entity/chat.model';

export class ChatRepositoryGetStateMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public apply(request: Request<{chatRoomId:number}, ApiResponse<Chat>, ApiRequest<Chat>, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>, number>, next: any) {

    try {
      // Get Primary ChatRoom Controller
      let chatRoomId = request.params.chatRoomId;
      let chatRoomController = (this.controllerManagerService.getPrimaryController(ChatRoomControllerName) as ChatRoomController);

      // Get ChatRoom for this call
      let chatRoom = chatRoomController.first(room => room.id === chatRoomId);

      // Chat Controllers are created with the chat room
      if (!chatRoom){
        response.status(500).send("Chat Room not found.");
      }
      else{
        let chatControllerName = this.controllerManagerService.getChatControllerName(chatRoomId);
        let chatController = (this.controllerManagerService.getPrimaryController(chatControllerName) as ChatController);

        // ChatController -> getState
        chatController.getState(request, response);
      }
    }
    catch (error) {
      console.log("Server Error:  Could not retrieve chat room state");
      console.log(error);
    }
  }
}
