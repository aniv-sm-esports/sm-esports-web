import {NextFunction} from 'express-serve-static-core';
import {EntityMiddleware} from './entity.middleware';
import {DefaultParams, ServerExpressEntityRequest, ServerExpressEntityResponse} from '../../server.definitions';
import {ServerEntityData} from '../../model/server-entity-data';
import {PageData} from '../../model/page-data.model';
import {ChatGroup} from '../../entity/model/ChatGroup';
import {ServerLogger} from '../../server.logger';
import {EntityController} from '../../entity/entity-controller';

export class ChatGroupMiddleware extends EntityMiddleware<ChatGroup, DefaultParams> {

  constructor(logger:ServerLogger, entityController:EntityController, routeBase:string, getRequiresLogon:boolean, createRequiresLogon:boolean) {
    super(logger, entityController, routeBase, getRequiresLogon, createRequiresLogon);
  }

  public override initialize() {
    this.cacheServer = this.entityController.chatGroups;
  }

  // Validation
  public override async validate(request: ServerExpressEntityRequest<ChatGroup, DefaultParams>, response: ServerExpressEntityResponse<ChatGroup>) {
    return this.validateCacheDiff(request, response);
  }

  // Validation -> Default Response
  public override respondDefault(request: ServerExpressEntityRequest<ChatGroup, DefaultParams>, response: ServerExpressEntityResponse<ChatGroup>) {
    this.sendCacheUpdate(request, response);
  }

  // Entity Cache State:  checkState
  public async checkState(request: ServerExpressEntityRequest<ChatGroup, DefaultParams>, response: ServerExpressEntityResponse<ChatGroup>, next: NextFunction){

    try {
      this.sendCacheUpdate(request, response);
      next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async getState(request: ServerExpressEntityRequest<ChatGroup, DefaultParams>, response: ServerExpressEntityResponse<ChatGroup>, next: NextFunction) {
    await this.checkState(request, response, next);
  }

  public async setState(request: ServerExpressEntityRequest<ChatGroup, DefaultParams>, response: ServerExpressEntityResponse<ChatGroup>, next: NextFunction) {
    this.logger.log("Unused Endpoint:  setState");
    next();
  }

  public async create(request: ServerExpressEntityRequest<ChatGroup, DefaultParams>, response: ServerExpressEntityResponse<ChatGroup>, next: NextFunction) {

    try {

      // Validate request data
      if (request.body.requestData.data.length != 1) {
        this.sendInputDataError("Request data must have one entity for creation (only)", request, response);
        next();
      }

      else {

        let value = await this.cacheServer.append(request.body.requestData.data[0]) as ChatGroup;

        // Success!
        this.sendSuccessData("Chat Group added to database successfully!", new ServerEntityData<ChatGroup>([value], new PageData(0,0)), request, response);

        next();
      }
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async get(request: ServerExpressEntityRequest<ChatGroup, DefaultParams>, response: ServerExpressEntityResponse<ChatGroup>, next: NextFunction) {

    try {
      let chatCategories = await this.cacheServer.getPage(request.body.pageData);

      // Success!
      this.sendSuccessData("", new ServerEntityData<ChatGroup>(chatCategories, request.body.pageData), request, response);
      next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async getAll(request: ServerExpressEntityRequest<ChatGroup, DefaultParams>, response: ServerExpressEntityResponse<ChatGroup>, next: NextFunction){
    try {
      let chatCategories = await this.cacheServer.getAll();

      // Success!
      this.sendSuccessData("", new ServerEntityData<ChatGroup>(chatCategories, request.body.pageData), request, response);
      next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }
}
