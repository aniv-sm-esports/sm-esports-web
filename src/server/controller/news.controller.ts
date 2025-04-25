import { RepositoryController} from './repository.controller';
import {Article} from '../../app/model/repository/entity/article.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {BaseController} from './base.controller';

export class NewsController extends RepositoryController<Article> {

  constructor(serverDb: DataModel, authService: AuthService, isPrimaryRepository:boolean) {
    super(serverDb, authService, isPrimaryRepository);
  }

  initialize() {
    if (this.initialized)
      return;

    this.repository = this.serverDb.news;
    this.defaultEntity = Article.default();
    this.initialized = true;
  }

  public clone(): BaseController {
    return new NewsController(this.serverDb, this.authService, false);
  }

  getByIdLogonRequired(): boolean {
    return false;
  }

  getEntityName(): string {
    return 'Article';
  }

  getLogonRequired(): boolean {
    return false;
  }

  getPageLogonRequired(): boolean {
    return false;
  }
}
