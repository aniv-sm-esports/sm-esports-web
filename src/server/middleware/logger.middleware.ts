import {ServerLocals} from '../server.application';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {AuthControllerName} from '../service/controller-const';
import {AuthController} from '../controller/auth.controller';
import { ControllerManagerService } from '../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from './base.middleware';

export class LoggerMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService, route:string, method:HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public override apply(request: Request, response: Response, next:NextFunction) {

    console.log("Server Request:  " + request.url.toString());

    next();
  }
}
