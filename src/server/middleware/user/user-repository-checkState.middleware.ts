import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {UserControllerName} from '../../service/controller-const';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {UserController} from '../../controller/user.controller';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import { User } from '../../../app/model/repository/entity/user.model';

export class UserRepositoryCheckStateMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public apply(request: Request<{}, ApiResponse<User>, ApiRequest<User>, ParsedQs, Record<string, any>>,
               response: Response<ApiResponse<User>, Record<string, any>, number>, next: any) {
    (this.controllerManagerService.getPrimaryController(UserControllerName) as UserController).checkState(request, response);
  }
}
