import {AuthService} from './auth.service';
import {DataModel} from '../model/server.datamodel';
import {BaseController} from '../controller/base.controller';
import {UserJWT} from '../../app/model/service/user-logon.model';
import {ChatRoom} from '../../app/model/repository/entity/chat-room.model';
import {ChatRoomControllerName} from './controller-const';
import {ChatController} from '../controller/chat.controller';

export class ControllerManagerService {

  private readonly primaryControllers: Map<string, BaseController>;
  private readonly sessionControllers: Map<string, BaseController>;

  constructor(private readonly serverDb:DataModel, private readonly authService: AuthService) {
    this.primaryControllers = new Map<string, BaseController>();
    this.sessionControllers = new Map<string, BaseController>();
  }

  // Initializes all controllers
  public initialize() {
    this.primaryControllers.forEach((controller: BaseController) => {
      controller.initialize();
    });
    this.sessionControllers.forEach((controller: BaseController) => {
      controller.initialize();
    });
  }

  public getChatControllerName(chatRoomId:number):string {
    return ChatRoomControllerName + `(${chatRoomId}) Chat Controller`;
  }

  // Design:  Due to typescript "literal" constraints, it is simpler to create this
  //          templated design pattern making this the primary manager component for
  //          the repository controllers.

  // Create a single sub-repository per user / per controller.
  private getControllerKey(repositoryName:string, user:UserJWT) {
    return repositoryName + user.userName;
  }

  // Creates a chat controller for the chat room
  public addChatController(chatRoomId:number) {
    let controllerKey = this.getChatControllerName(chatRoomId);

    if (this.primaryControllers.has(controllerKey)) {
      return this.primaryControllers.get(controllerKey);
    }
    else {
      let controller = new ChatController(chatRoomId, this.serverDb, this.authService, true);

      // Initialize ChatController
      controller.initialize();

      this.primaryControllers.set(controllerKey, controller);
      return controller;
    }
  }

  // Sets a primary controller for the given repository (name)
  public setPrimaryController(repositoryName:string, controller:BaseController) {
    if (this.primaryControllers.has(repositoryName)) {
      console.log(`Error: Trying to overwrite primary repository:  ${repositoryName}`);
      return;
    }

    this.primaryControllers.set(repositoryName, controller);
  }

  // Gets a primary controller for the given repository (name)
  public getPrimaryController(repositoryName:string) {
    return this.primaryControllers.get(repositoryName);
  }

  // Gets controller (base) for this particular user. The Base Controller is the parent of
  // this one; but this controller (for the user) will be a separate instance with its own
  // filter.
  public getSessionController(repositoryName:string, user:UserJWT) {

    let parentController = this.primaryControllers.get(repositoryName);
    let key = this.getControllerKey(repositoryName, user);

    if (!parentController) {
      console.log(`Error: Repository Name Not Found!  ${repositoryName}`);
      return;
    }

    if (this.sessionControllers.has(key)) {
      return this.sessionControllers.get(key);
    }
    else {
      let controller = parentController.clone();
      this.sessionControllers.set(key, controller);
    }

    return this.sessionControllers.get(key);
  }
}
