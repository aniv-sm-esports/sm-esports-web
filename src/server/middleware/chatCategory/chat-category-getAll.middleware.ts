import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import { Chat } from '../../../app/model/repository/entity/chat.model';
import {ChatController} from '../../controller/chat.controller';
import {ChatCategory} from '../../../app/model/repository/entity/chat-category.model';
import {ChatCategoryControllerName} from '../../service/controller-const';
import {ChatCategoryController} from '../../controller/chat-category.controller';

export class ChatCategoryGetAllMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public override apply(request: Request<{}, ApiResponse<ChatCategory>, ApiRequest<ChatCategory>, ParsedQs, Record<string, any>>,
                        response: Response<any, Record<string, any>, number>, next: any) {

    (this.controllerManagerService.getPrimaryController(ChatCategoryControllerName) as ChatCategoryController).getAll(request, response);
  }
}
