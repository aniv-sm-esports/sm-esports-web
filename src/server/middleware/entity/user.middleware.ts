import {NextFunction} from 'express-serve-static-core';
import {EntityMiddleware} from './entity.middleware';
import {DefaultParams, ServerExpressEntityRequest, ServerExpressEntityResponse} from '../../server.definitions';
import {ServerEntityData} from '../../model/server-entity-data';
import {PageData} from '../../model/page-data.model';
import { User } from '../../entity/model/User';
import {ServerLogger} from '../../server.logger';
import {EntityController} from '../../entity/entity-controller';

export class UserMiddleware extends EntityMiddleware<User, DefaultParams> {

  constructor(logger:ServerLogger, entityController:EntityController, routeBase:string, getRequiresLogon:boolean, createRequiresLogon:boolean) {
    super(logger, entityController, routeBase, getRequiresLogon, createRequiresLogon);
  }

  public override initialize() {
    this.cacheServer = this.entityController.users;
  }

  // Validation
  public override async validate(request: ServerExpressEntityRequest<User, DefaultParams>, response: ServerExpressEntityResponse<User>) {
    return this.validateCacheDiff(request, response);
  }

  // Validation -> Default Response
  public override respondDefault(request: ServerExpressEntityRequest<User, DefaultParams>, response: ServerExpressEntityResponse<User>) {
    this.sendCacheUpdate(request, response);
  }

  // Entity Cache State:  checkState
  public async checkState(request: ServerExpressEntityRequest<User, DefaultParams>, response: ServerExpressEntityResponse<User>, next: NextFunction){

    try {

      this.logger.logWarning("HERE!  " + request.url);

      this.sendCacheUpdate(request, response);
      next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async getState(request: ServerExpressEntityRequest<User, DefaultParams>, response: ServerExpressEntityResponse<User>, next: NextFunction) {
    await this.checkState(request, response, next);
  }

  public async setState(request: ServerExpressEntityRequest<User, DefaultParams>, response: ServerExpressEntityResponse<User>, next: NextFunction) {
    this.logger.log("Unused Endpoint:  setState");
    //next();
  }

  public async create(request: ServerExpressEntityRequest<User, DefaultParams>, response: ServerExpressEntityResponse<User>, next: NextFunction) {

    try {

      // Validate request data
      if (request.body.requestData.data.length != 1) {
        this.sendInputDataError("Request data must have one entity for creation (only)", request, response);
        //next();
      }

      else {

        let value = await this.cacheServer.append(request.body.requestData.data[0]) as User;

        // Success!
        this.sendSuccessData("User added to database successfully!", new ServerEntityData<User>([value], new PageData(0,0)), request, response);

        //next();
      }
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async get(request: ServerExpressEntityRequest<User, DefaultParams>, response: ServerExpressEntityResponse<User>, next: NextFunction) {

    try {
      let result = await this.cacheServer.getPage(request.body.pageData);

      // Success!
      this.sendSuccessData("", new ServerEntityData<User>(result, request.body.pageData), request, response);
      //next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }

  public async getAll(request: ServerExpressEntityRequest<User, DefaultParams>, response: ServerExpressEntityResponse<User>, next: NextFunction){
    try {
      let result = await this.cacheServer.getAll();

      // Success!
      this.sendSuccessData("", new ServerEntityData<User>(result, request.body.pageData), request, response);
      //next();
    }
    catch(error:any){
      this.logger.log(error);
    }
  }
}
