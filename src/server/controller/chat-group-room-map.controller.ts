import {RepositoryController} from './repository.controller';
import {Chat} from '../../app/model/repository/entity/chat.model';
import {Repository} from '../../app/model/repository/repository.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {SearchModel} from '../../app/model/repository/search.model';
import {BaseController} from './base.controller';
import {RepositoryServer} from '../../app/model/repository/repository-server.model';
import { ChatGroupRoomMap } from '../../app/model/repository/entity/chat-group-room-map.model';

export class ChatGroupRoomMapController extends RepositoryController<ChatGroupRoomMap> {

  constructor(serverDb: DataModel, authService: AuthService, isPrimary:boolean) {
    super(serverDb, authService, isPrimary);
  }

  initialize() {
    this.repository = this.serverDb.chatGroupRoomMaps;
    return ChatGroupRoomMap.default();
  }

  public clone(): BaseController {
    return new ChatGroupRoomMapController(this.serverDb, this.authService, false);
  }

  getByIdLogonRequired(): boolean {
    return false;
  }

  getEntityName(): string {
    return `ChatGroupRoomMap`;
  }

  getLogonRequired(): boolean {
    return false;
  }

  getPageLogonRequired(): boolean {
    return false;
  }
}
