import {NextFunction, Request, Response} from 'express-serve-static-core';
import { ControllerManagerService } from '../service/controller-manager.service';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST'
}

export abstract class MiddlewareBase {

  protected readonly controllerManagerService: ControllerManagerService

  public readonly route: string;
  public readonly method: HttpMethod;
  public abstract apply(req: any, res: any, next: NextFunction):void;

  protected constructor(controllerManagerService: ControllerManagerService, route:string, method:HttpMethod) {
    this.controllerManagerService = controllerManagerService;
    this.route = route;
    this.method = method;
  }
}
