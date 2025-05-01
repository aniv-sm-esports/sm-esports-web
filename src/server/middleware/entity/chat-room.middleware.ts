import {NextFunction} from 'express-serve-static-core';
import {EntityMiddleware} from './entity.middleware';
import {DefaultParams, ServerExpressEntityRequest, ServerExpressEntityResponse} from '../../server.definitions';
import {ServerEntityData} from '../../model/server-entity-data';
import {PageData} from '../../model/page-data.model';
import {ChatRoom} from '../../entity/model/ChatRoom';
import {ServerLogger} from '../../server.logger';
import {EntityController} from '../../entity/entity-controller';

export class ChatRoomMiddleware extends EntityMiddleware<ChatRoom, DefaultParams> {

  constructor(logger:ServerLogger, entityController:EntityController, routeBase:string, getRequiresLogon:boolean, createRequiresLogon:boolean) {
    super(logger, entityController, routeBase, getRequiresLogon, createRequiresLogon);
  }

  public override initialize() {
    this.cacheServer = this.entityController.chatRooms;
  }

  // Validation
  public override async validate(request: ServerExpressEntityRequest<ChatRoom, DefaultParams>, response: ServerExpressEntityResponse<ChatRoom>) {
    return this.validateCacheDiff(request, response);
  }

  // Validation -> Default Response
  public override respondDefault(request: ServerExpressEntityRequest<ChatRoom, DefaultParams>, response: ServerExpressEntityResponse<ChatRoom>) {
    this.sendCacheUpdate(request, response);
  }

  // Entity Cache State:  checkState
  public async checkState(request: ServerExpressEntityRequest<ChatRoom, DefaultParams>, response: ServerExpressEntityResponse<ChatRoom>, next: NextFunction){

    try {
      this.sendCacheUpdate(request, response);
      next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async getState(request: ServerExpressEntityRequest<ChatRoom, DefaultParams>, response: ServerExpressEntityResponse<ChatRoom>, next: NextFunction) {
    await this.checkState(request, response, next);
  }

  public async setState(request: ServerExpressEntityRequest<ChatRoom, DefaultParams>, response: ServerExpressEntityResponse<ChatRoom>, next: NextFunction) {
    this.logger.log("Unused Endpoint:  setState");
    next();
  }

  public async create(request: ServerExpressEntityRequest<ChatRoom, DefaultParams>, response: ServerExpressEntityResponse<ChatRoom>, next: NextFunction) {

    try {

      // Validate request data
      if (request.body.requestData.data.length != 1) {
        this.sendInputDataError("Request data must have one entity for creation (only)", request, response);
        next();
      }

      else {

        let value = await this.cacheServer.append(request.body.requestData.data[0]) as ChatRoom;

        // Success!
        this.sendSuccessData("Chat Group Room Map added to database successfully!", new ServerEntityData<ChatRoom>([value], new PageData(0,0)), request, response);

        next();
      }
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async get(request: ServerExpressEntityRequest<ChatRoom, DefaultParams>, response: ServerExpressEntityResponse<ChatRoom>, next: NextFunction) {

    try {
      let result = await this.cacheServer.getPage(request.body.pageData);

      // Success!
      this.sendSuccessData("", new ServerEntityData<ChatRoom>(result, request.body.pageData), request, response);
      next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async getAll(request: ServerExpressEntityRequest<ChatRoom, DefaultParams>, response: ServerExpressEntityResponse<ChatRoom>, next: NextFunction){
    try {
      let result = await this.cacheServer.getAll();

      // Success!
      this.sendSuccessData("", new ServerEntityData<ChatRoom>(result, request.body.pageData), request, response);
      next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }
}
