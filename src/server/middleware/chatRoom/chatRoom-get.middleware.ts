import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import {ChatRoomControllerName} from '../../service/controller-const';
import {ChatRoom} from '../../../app/model/repository/entity/chat-room.model';
import {ChatRoomController} from '../../controller/chat-room.controller';

export class ChatRoomGetMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public override apply(request: Request<{}, ApiResponse<ChatRoom>, ApiRequest<ChatRoom>, ParsedQs, Record<string, any>>,
                        response: Response<any, Record<string, any>, number>, next: any) {
    (this.controllerManagerService.getPrimaryController(ChatRoomControllerName) as ChatRoomController).get(request, response);
  }
}
