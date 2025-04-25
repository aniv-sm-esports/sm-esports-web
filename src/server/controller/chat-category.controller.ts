import {RepositoryController} from './repository.controller';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {SearchModel} from '../../app/model/repository/search.model';
import {BaseController} from './base.controller';
import {RepositoryServer} from '../../app/model/repository/repository-server.model';
import { ChatCategory } from '../../app/model/repository/entity/chat-category.model';

export class ChatCategoryController extends RepositoryController<ChatCategory> {

  constructor(serverDb: DataModel, authService: AuthService, isPrimary:boolean) {
    super(serverDb, authService, isPrimary);
  }

  initialize() {

    if (this.initialized)
      return;

    this.repository = this.serverDb.chatCategories;
    this.defaultEntity = ChatCategory.default();
    this.initialized = true;
  }

  public clone(): BaseController {
    return new ChatCategoryController(this.serverDb, this.authService, false);
  }

  getByIdLogonRequired(): boolean {
    return false;
  }

  getEntityName(): string {
    return `ChatCategory`;
  }

  getLogonRequired(): boolean {
    return false;
  }

  getPageLogonRequired(): boolean {
    return false;
  }
}
