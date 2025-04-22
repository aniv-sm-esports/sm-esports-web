import {ServerLocals} from '../server.application';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {AuthControllerName} from '../service/controller-const';
import {AuthController} from '../controller/auth.controller';
import { ControllerManagerService } from '../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from './base.middleware';

export class AuthMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService, route:string, method:HttpMethod) {
    super(controllerManagerService, route, method);
  }


  // BYPASS FOR DEVELOPMENT:  Next problem is to implement the JWKS server
  public override apply(request: Request, response: Response, next:NextFunction) {

    // Auth Service -> Get Session (UserJWT)
    //let userJWT = (this.controllerManagerService.getPrimaryController(AuthControllerName) as AuthController).authenticate(request, response);

    // INITIALIZE LOCALS!
    //response.locals = new ServerLocals();
    //response.locals['userJWT'] = userJWT;

    next();
  }
}
