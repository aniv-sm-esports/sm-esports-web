import {NextFunction} from 'express-serve-static-core';
import {Entity} from '../../entity/model/Entity';
import {ServerExpressEntityRequest, ServerExpressEntityResponse,} from '../../server.definitions';
import {EntityController} from '../../entity/entity-controller';
import {ServerLogger} from '../../server.logger';
import {EntityCacheServer} from '../../entity/entity-cache-server';
import {EntityCacheStateDiffer} from '../../entity/entity-cache-state-differ';
import {ServerCacheDiffResult, ServerEntityResponse, ServerResponseType} from '../../model/server-response.model';
import {ServerData} from '../../model/server-entity-data';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST'
}

export abstract class EntityMiddleware<T extends Entity<T>, U extends {}> {

  // Must be set on initialize()
  protected cacheServer!:EntityCacheServer<T>;

  public readonly routeBase: string;
  public readonly getRequiresLogon:boolean;
  public readonly createRequiresLogon:boolean;

  // Entity Cache State
  public abstract checkState(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>, next: NextFunction):void;
  public abstract getState(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>, next: NextFunction):void;
  public abstract setState(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>, next: NextFunction):void;

  // Entity CRUD Operations
  public abstract get(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>, next: NextFunction):void;
  public abstract getAll(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>, next: NextFunction):void;
  public abstract create(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>, next: NextFunction):void;

  public abstract initialize():void;
  public abstract validate(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>):Promise<boolean>;
  public abstract respondDefault(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>):void;

  private send(statusCode:number,
               message:string,
               serverData:ServerData<T>,
               responseType:ServerResponseType,
               request: ServerExpressEntityRequest<T, U>,
               response: ServerExpressEntityResponse<T>) {

    let serverState = this.cacheServer.cloneState();
    let diff = EntityCacheStateDiffer.stateDataDiff(serverState, request.body.cacheState);
    let diffResult = diff ? ServerCacheDiffResult.ClientInvalid : ServerCacheDiffResult.Synchronized;

    response.status(statusCode).send(new ServerEntityResponse<T>(this.cacheServer.cloneState(), diffResult, serverData, responseType, message));
  }

  // Default response for cache state update
  public sendCacheUpdate(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>) {
    this.send(200, '', request.body.requestData, ServerResponseType.Success, request, response);
  }

  // Sends data input error to client
  public sendInputDataError(message:string, request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>) {
    this.send(401, '', request.body.requestData, ServerResponseType.InputDataError, request, response);
  }

  // Sends data input error to client
  public sendSuccess(message:string, request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>) {
    this.send(200, message, request.body.requestData, ServerResponseType.Success, request, response);
  }

  // Sends data input error to client
  public sendSuccessData(message:string, data:ServerData<T>, request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>) {
    this.send(200, message, data, ServerResponseType.Success, request, response);
  }

  // Validates the cache state data before running a request (run with validate())
  protected validateCacheDiff(request: ServerExpressEntityRequest<T, U>, response: ServerExpressEntityResponse<T>):boolean {
    let serverState = this.cacheServer.cloneState();
    return EntityCacheStateDiffer.stateDataDiff(serverState, request.body.cacheState);
  }

  protected constructor(protected readonly logger:ServerLogger,
                        protected readonly entityController:EntityController,
                        routeBase:string,
                        getRequiresLogon:boolean,
                        createRequiresLogon:boolean) {
    this.routeBase = routeBase;
    this.getRequiresLogon = getRequiresLogon;
    this.createRequiresLogon = createRequiresLogon;
  }
}
