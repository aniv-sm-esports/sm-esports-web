import {RepositoryController} from './repository.controller';
import {ChatRoom} from '../../app/model/repository/entity/chat-room.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {BaseController} from './base.controller';

export class ChatRoomController extends RepositoryController<ChatRoom> {

  constructor(serverDb: DataModel, authService: AuthService, isPrimaryRepository:boolean) {
    super(serverDb, authService, isPrimaryRepository);
  }

  initialize() {
    if (this.initialized)
      return;

    this.repository = this.serverDb.chatRooms;
    this.defaultEntity = ChatRoom.default();
    this.initialized = true;
  }

  public clone(): BaseController {
    return new ChatRoomController(this.serverDb, this.authService, false);
  }

  getByIdLogonRequired(): boolean {
    return false;
  }

  getEntityName(): string {
    return 'ChatRoom';
  }

  getLogonRequired(): boolean {
    return false;
  }

  getPageLogonRequired(): boolean {
    return false;
  }
}
