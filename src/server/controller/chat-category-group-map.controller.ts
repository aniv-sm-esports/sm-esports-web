import {RepositoryController} from './repository.controller';
import {Chat} from '../../app/model/repository/entity/chat.model';
import {Repository} from '../../app/model/repository/repository.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {SearchModel} from '../../app/model/repository/search.model';
import {BaseController} from './base.controller';
import {RepositoryServer} from '../../app/model/repository/repository-server.model';
import {ChatCategoryGroupMap} from '../../app/model/repository/entity/chat-category-group-map.model';

export class ChatCategoryGroupMapController extends RepositoryController<ChatCategoryGroupMap> {

  constructor(serverDb: DataModel, authService: AuthService, isPrimary:boolean) {
    super(serverDb, authService, isPrimary);
  }

  initialize() {

    if (this.initialized)
      return;

    this.repository = this.serverDb.chatCategoryGroupMaps;
    this.defaultEntity = ChatCategoryGroupMap.default();
    this.initialized = true;
  }

  public clone(): BaseController {
    return new ChatCategoryGroupMapController(this.serverDb, this.authService, false);
  }

  getByIdLogonRequired(): boolean {
    return false;
  }

  getEntityName(): string {
    return `ChatCategoryGroupMap`;
  }

  getLogonRequired(): boolean {
    return false;
  }

  getPageLogonRequired(): boolean {
    return false;
  }
}
