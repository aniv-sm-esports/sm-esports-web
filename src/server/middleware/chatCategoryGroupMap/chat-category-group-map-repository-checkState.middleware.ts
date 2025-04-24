import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {ChatCategoryGroupMapControllerName, ChatRoomControllerName} from '../../service/controller-const';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import { User } from '../../../app/model/repository/entity/user.model';
import {ChatRoomController} from '../../controller/chat-room.controller';
import {ChatController} from '../../controller/chat.controller';
import { Chat } from '../../../app/model/repository/entity/chat.model';
import {ChatCategoryGroupMap} from '../../../app/model/repository/entity/chat-category-group-map.model';
import {ChatCategoryGroupMapController} from '../../controller/chat-category-group-map.controller';

export class ChatCategoryGroupMapRepositoryCheckStateMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public override apply(request: Request<{}, ApiResponse<ChatCategoryGroupMap>, ApiRequest<ChatCategoryGroupMap>, ParsedQs, Record<string, any>>,
                        response: Response<any, Record<string, any>, number>, next: any) {

    (this.controllerManagerService.getPrimaryController(ChatCategoryGroupMapControllerName) as ChatCategoryGroupMapController).checkState(request, response);
  }
}
