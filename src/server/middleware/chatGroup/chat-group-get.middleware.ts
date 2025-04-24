import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import {ChatController} from '../../controller/chat.controller';
import {Chat} from '../../../app/model/repository/entity/chat.model';
import {ChatGroup} from '../../../app/model/repository/entity/chat-group.model';
import {ChatGroupControllerName} from '../../service/controller-const';
import {ChatGroupController} from '../../controller/chat-group.controller';

export class ChatGroupGetMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public override apply(request: Request<{}, ApiResponse<ChatGroup>, ApiRequest<ChatGroup>, ParsedQs, Record<string, any>>,
                        response: Response<any, Record<string, any>, number>, next: any) {

    (this.controllerManagerService.getPrimaryController(ChatGroupControllerName) as ChatGroupController).get(request, response);
  }
}
