import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {AuthControllerName} from '../../service/controller-const';
import {AuthController} from '../../controller/auth.controller';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {UserJWT, UserCredentials} from '../../../app/model/service/user-logon.model';

export class AuthGetSessionMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public apply(request: Request<{}, UserJWT, UserCredentials, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>, number>, next: any) {

    // Logged On
    if (response.locals["userJWT"] !== UserJWT.default()) {
      response.status(200).send(response.locals['userJWT']);
    }
    // Not Logged On
    else {
      response.status(200).send(UserJWT.default());
    }
  }
}
