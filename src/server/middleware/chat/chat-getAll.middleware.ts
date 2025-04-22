import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import { Chat } from '../../../app/model/repository/entity/chat.model';
import {ChatController} from '../../controller/chat.controller';

export class ChatGetAllMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public override apply(request: Request<{chatRoomId:number}, ApiResponse<Chat>, ApiRequest<Chat>, ParsedQs, Record<string, any>>,
                        response: Response<any, Record<string, any>, number>, next: any) {
    let chatRoomId = request.params.chatRoomId;
    let chatKey = this.controllerManagerService.getChatControllerName(chatRoomId);
    let chatController = this.controllerManagerService.getPrimaryController(chatKey) as ChatController;

    if (!chatController) {
      response.status(500).send("Chat Room not found.");
    }
    else {
      chatController.getAll(request, response);
    }
  }
}
