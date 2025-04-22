import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {AuthControllerName} from '../../service/controller-const';
import {AuthController} from '../../controller/auth.controller';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {UserJWT, UserCredentials} from '../../../app/model/service/user-logon.model';

export class AuthLoginMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  // BYPASS FOR DEVELOPMENT:  Next problem is to implement the JWKS server
  public apply(request: Request<{}, UserJWT, UserCredentials, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>, number>, next: any) {
    (this.controllerManagerService.getPrimaryController(AuthControllerName) as AuthController).logon(request, response);
  }
}
