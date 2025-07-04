import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {ChatRoomControllerName} from '../../service/controller-const';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import {ChatRoom} from '../../../app/model/repository/entity/chat-room.model';
import {ChatRoomController} from '../../controller/chat-room.controller';

export class ChatRoomRepositoryGetStateMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public apply(request: Request<{}, ApiResponse<ChatRoom>, ApiRequest<ChatRoom>, ParsedQs, Record<string, any>>,
               response: Response<ApiResponse<ChatRoom>, Record<string, any>, number>, next: any) {
    (this.controllerManagerService.getPrimaryController(ChatRoomControllerName) as ChatRoomController).getState(request, response);
  }
}
