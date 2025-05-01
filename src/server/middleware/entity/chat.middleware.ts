import {NextFunction, ParamsDictionary} from 'express-serve-static-core';
import {Chat} from '../../entity/model/Chat';
import {EntityMiddleware} from './entity.middleware';
import {ChatRoom} from '../../entity/model/ChatRoom';
import {ChatParams, ServerExpressEntityRequest, ServerExpressEntityResponse} from '../../server.definitions';
import {UserJWT} from '../../entity/model/UserJWT';
import {ServerData, ServerEntityData} from '../../model/server-entity-data';
import {PageData} from '../../model/page-data.model';
import {ServerLogger} from '../../server.logger';
import {EntityController} from '../../entity/entity-controller';
import {ServerEntityResponse} from '../../model/server-response.model';

export class ChatMiddleware extends EntityMiddleware<Chat, ChatParams> {

  constructor(logger:ServerLogger, entityController:EntityController, routeBase:string, getRequiresLogon:boolean, createRequiresLogon:boolean) {
    super(logger, entityController, routeBase, getRequiresLogon, createRequiresLogon);
  }

  public override initialize() {
    this.cacheServer = this.entityController.chats;
  }

  // Validation
  public override async validate(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>) {
    return this.validateRequest(request, response) &&
           this.validateCacheDiff(request, response) &&
         !!await Promise.resolve(this.validateChatRoom(request, response));
  }

  // Validation -> Request (:chatRoomId)
  private validateRequest(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>) {

    if (!request.params?.chatRoomId) {
      console.log("Chat Room Id not included in URL");
      response.status(500).send(ServerEntityResponse.fromError("Chat Room not found."));
      return false;
    }

    return true;
  }

  // Validation -> ChatRoom
  private async validateChatRoom(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>) {

    let chatRoomId = Number(request.params?.chatRoomId);
    return await this.entityController.chatRooms.first({
      Id: chatRoomId
    }) as ChatRoom | undefined;
  }

  // Validation -> Default Response
  public override respondDefault(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>) {
    this.sendCacheUpdate(request, response);
  }

  // Entity Cache State:  checkState
  public async checkState(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>, next: NextFunction){

    try {

      // Get ChatRoom (validation not needed, just a get)
      let chatRoom = await this.validateChatRoom(request, response) as ChatRoom;

      if (!chatRoom) {
        response.status(500).send(ServerEntityResponse.fromError("Chat Room not found."));
      }
      else {
        this.sendCacheUpdate(request, response);
        next();
      }
    }
    catch(error:any){
      this.logger.log("Server Error:  Could not post chat");
      this.logger.log(error);
    }
  }

  public async getState(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>, next: NextFunction) {
    await this.checkState(request, response, next);
  }

  public async setState(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>, next: NextFunction) {
    this.logger.log("Unused Endpoint:  setState");
    next();
  }

  public async create(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>, next: NextFunction) {

    try {

      // Validate request data
      if (request.body.requestData.data.length != 1) {
        this.sendInputDataError("Request data must have one entity for creation (only)", request, response);
        next();
      }

      else {

        // Get ChatRoom
        let chatRoom = await this.validateChatRoom(request, response) as ChatRoom;

        if (!chatRoom) {
          response.status(500).send(ServerEntityResponse.fromError("Chat Room not found."));
          next();
        } else {

          let entity = new Chat();
          let userJWT = response.locals['userJWT'] as UserJWT;      // Pre-validated for this middleware function

          entity.UserId = userJWT.UserId;
          entity.Date = new Date();
          entity.Flagged = false;
          entity.FlaggedComments = '';
          entity.Text = request.body.requestData.data[0].Text;

          let value = await this.cacheServer.append(entity) as Chat;

          // Success!
          this.sendSuccessData("Chat added to database successfully!", new ServerEntityData<Chat>([value], new PageData(0,0)), request, response);

          next();
        }
      }
    }
    catch(error:any){
      this.logger.log("Server Error:  Could not post chat");
      this.logger.log(error);
    }
  }

  public async get(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>, next: NextFunction) {

    try {

      // Get ChatRoom
      let chatRoom = await this.validateChatRoom(request, response) as ChatRoom;

      if (!chatRoom) {
        response.status(500).send(ServerEntityResponse.fromError("Chat Room not found."));
        next();
      }
      else {

        let chats = await this.cacheServer.getPage(request.body.pageData);

        // Success!
        this.sendSuccessData("", new ServerEntityData<Chat>(chats, request.body.pageData), request, response);

        next();
      }
    }
    catch(error:any){
      this.logger.log("Server Error:  Could not get chats");
      this.logger.log(error);
    }
  }

  public async getAll(request: ServerExpressEntityRequest<Chat, ChatParams>, response: ServerExpressEntityResponse<Chat>, next: NextFunction){
    try {

      // Get ChatRoom
      let chatRoom = await this.validateChatRoom(request, response) as ChatRoom;

      if (!chatRoom) {
        response.status(500).send(ServerEntityResponse.fromError("Chat Room not found."));
        next();
      }
      else {

        let chats = await this.cacheServer.getAll();

        // Success!
        this.sendSuccessData("", new ServerEntityData<Chat>(chats, request.body.pageData), request, response);

        next();
      }
    }
    catch(error:any){
      this.logger.log("Server Error:  Could not get chats");
      this.logger.log(error);
    }
  }
}
