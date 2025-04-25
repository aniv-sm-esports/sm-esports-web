import {RepositoryController} from './repository.controller';
import {Chat} from '../../app/model/repository/entity/chat.model';
import {Repository} from '../../app/model/repository/repository.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {SearchModel} from '../../app/model/repository/search.model';
import {BaseController} from './base.controller';
import {RepositoryServer} from '../../app/model/repository/repository-server.model';
import { ChatGroup } from '../../app/model/repository/entity/chat-group.model';

export class ChatGroupController extends RepositoryController<ChatGroup> {

  constructor(serverDb: DataModel, authService: AuthService, isPrimary:boolean) {
    super(serverDb, authService, isPrimary);
  }

  initialize() {
    if (this.initialized)
      return;

    this.repository = this.serverDb.chatGroups;
    this.defaultEntity = ChatGroup.default();
    this.initialized = true;
  }

  public clone(): BaseController {
    return new ChatGroupController(this.serverDb, this.authService, false);
  }

  getByIdLogonRequired(): boolean {
    return false;
  }

  getEntityName(): string {
    return `ChatGroup`;
  }

  getLogonRequired(): boolean {
    return false;
  }

  getPageLogonRequired(): boolean {
    return false;
  }
}
