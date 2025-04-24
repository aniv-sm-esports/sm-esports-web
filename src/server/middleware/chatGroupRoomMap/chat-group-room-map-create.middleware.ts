import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import { ChatRoom } from '../../../app/model/repository/entity/chat-room.model';
import {ChatController} from '../../controller/chat.controller';
import {Chat} from '../../../app/model/repository/entity/chat.model';
import {ChatGroup} from '../../../app/model/repository/entity/chat-group.model';
import {ChatGroupControllerName, ChatGroupRoomMapControllerName} from '../../service/controller-const';
import {ChatGroupController} from '../../controller/chat-group.controller';
import {ChatGroupRoomMapController} from '../../controller/chat-group-room-map.controller';
import { ChatGroupRoomMap } from '../../../app/model/repository/entity/chat-group-room-map.model';

export class ChatGroupRoomMapCreateMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public override apply(request: Request<{}, ApiResponse<ChatGroupRoomMap>, ApiRequest<ChatGroupRoomMap>, ParsedQs, Record<string, any>>,
                        response: Response<ApiResponse<ChatGroupRoomMap>, Record<string, any>, number>, next: any) {

    (this.controllerManagerService.getPrimaryController(ChatGroupRoomMapControllerName) as ChatGroupRoomMapController).create(request, response);
  }
}
