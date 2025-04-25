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
      if (!request.params?.chatRoomId) {
        console.log("Chat Room Id not included in URL");
        response.status(500).send("Chat Room not found.");
        return;
      }

      let chatRoomId = Number(request.params?.chatRoomId);
      let chatRoomController = this.controllerManagerService.getPrimaryController(ChatRoomControllerName) as ChatRoomController;
      let chatRoom = chatRoomController.first(x => x.id === chatRoomId);

      if (!chatRoom) {
        response.status(500).send("Chat Room not found.");
      }

      let chatKey = this.controllerManagerService.getChatControllerName(chatRoomId);
      let chatController = this.controllerManagerService.getPrimaryController(chatKey) as ChatController;

      if (!chatController) {
        chatController = this.controllerManagerService.addChatController(chatRoomId) as ChatController;
      }

      chatController.getState(request, response);
    }
    catch(error){
      console.log("Server Error:  Could not post chat");
      console.log(error);
    }
  }
}
