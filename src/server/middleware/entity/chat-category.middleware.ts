import {NextFunction} from 'express-serve-static-core';
import {EntityMiddleware} from './entity.middleware';
import {DefaultParams, ServerExpressEntityRequest, ServerExpressEntityResponse} from '../../server.definitions';
import {UserJWT} from '../../entity/model/UserJWT';
import {ServerEntityData} from '../../model/server-entity-data';
import {PageData} from '../../model/page-data.model';
import {ChatCategory} from '../../entity/model/ChatCategory';
import {ServerLogger} from '../../server.logger';
import {EntityController} from '../../entity/entity-controller';

export class ChatCategoryMiddleware extends EntityMiddleware<ChatCategory, DefaultParams> {

  constructor(logger:ServerLogger, entityController:EntityController, routeBase:string, getRequiresLogon:boolean, createRequiresLogon:boolean) {
    super(logger, entityController, routeBase, getRequiresLogon, createRequiresLogon);
  }

  public override initialize() {
    this.cacheServer = this.entityController.chatCategories;
  }

  // Validation
  public override async validate(request: ServerExpressEntityRequest<ChatCategory, DefaultParams>, response: ServerExpressEntityResponse<ChatCategory>) {
    return this.validateCacheDiff(request, response);
  }

  // Validation -> Default Response
  public override respondDefault(request: ServerExpressEntityRequest<ChatCategory, DefaultParams>, response: ServerExpressEntityResponse<ChatCategory>) {
    this.sendCacheUpdate(request, response);
  }

  // Entity Cache State:  checkState
  public async checkState(request: ServerExpressEntityRequest<ChatCategory, DefaultParams>, response: ServerExpressEntityResponse<ChatCategory>, next: NextFunction){

    try {
      this.sendCacheUpdate(request, response);
      next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async getState(request: ServerExpressEntityRequest<ChatCategory, DefaultParams>, response: ServerExpressEntityResponse<ChatCategory>, next: NextFunction) {
    await this.checkState(request, response, next);
  }

  public async setState(request: ServerExpressEntityRequest<ChatCategory, DefaultParams>, response: ServerExpressEntityResponse<ChatCategory>, next: NextFunction) {
    this.logger.log("Unused Endpoint:  setState");
    next();
  }

  public async create(request: ServerExpressEntityRequest<ChatCategory, DefaultParams>, response: ServerExpressEntityResponse<ChatCategory>, next: NextFunction) {

    try {

      // Validate request data
      if (request.body.requestData.data.length != 1) {
        this.sendInputDataError("Request data must have one entity for creation (only)", request, response);
        next();
      }

      else {

        let entity = new ChatCategory();
        let userJWT = response.locals['userJWT'] as UserJWT;      // Pre-validated for this middleware function

        entity.Name = request.body.requestData.data[0].Name;
        entity.Description = request.body.requestData.data[0].Name;

        let value = await this.cacheServer.append(entity) as ChatCategory;

        // Success!
        this.sendSuccessData("Chat Category added to database successfully!", new ServerEntityData<ChatCategory>([value], new PageData(0,0)), request, response);

        next();
      }
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async get(request: ServerExpressEntityRequest<ChatCategory, DefaultParams>, response: ServerExpressEntityResponse<ChatCategory>, next: NextFunction) {

    try {
        let chatCategories = await this.cacheServer.getPage(request.body.pageData);

        // Success!
        this.sendSuccessData("", new ServerEntityData<ChatCategory>(chatCategories, request.body.pageData), request, response);
        next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async getAll(request: ServerExpressEntityRequest<ChatCategory, DefaultParams>, response: ServerExpressEntityResponse<ChatCategory>, next: NextFunction){
    try {
      let chatCategories = await this.cacheServer.getAll();

      // Success!
      this.sendSuccessData("", new ServerEntityData<ChatCategory>(chatCategories, request.body.pageData), request, response);
      next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }
}
