import {NextFunction, ParamsDictionary, Request, Response} from 'express-serve-static-core';
import {HttpMethod} from './entity/entity.middleware';
import {ServerExpressEntityRequest, ServerExpressEntityResponse, ServerExpressRequest, ServerExpressResponse} from '../server.definitions';
import { ServerLogger } from '../server.logger';

export class LoggerMiddleware {

  constructor(private readonly logger: ServerLogger) {
  }

  public logRequest(request: ServerExpressRequest<any, ParamsDictionary>, response: ServerExpressResponse<any>, next:NextFunction) {

    this.logger.log("Server Request:  " + request.url.toString());
    next();
  }

  public logEntityRequest(request: ServerExpressEntityRequest<any, ParamsDictionary>, response: ServerExpressEntityResponse<any>, next:NextFunction) {

    this.logger.log("Server Request:  " + request.url.toString());
    next();
  }
}
