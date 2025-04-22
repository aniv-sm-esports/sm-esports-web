import {User} from '../../app/model/repository/entity/user.model';
import {RepositoryController} from './repository.controller';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {BaseController} from './base.controller';

export class UserController extends RepositoryController<User> {

  constructor(serverDb: DataModel, authService: AuthService, isPrimaryRepository:boolean) {
    super(serverDb, authService, isPrimaryRepository);
  }

  // Called from super()
  initialize() {
    this.repository = this.serverDb.users;
    return User.default();
  }

  clone(): BaseController {
    return new UserController(this.serverDb, this.authService, false);
  }

  getByIdLogonRequired(): boolean {
    return false;
  }

  getEntityName(): string {
    return 'User';
  }

  getLogonRequired(): boolean {
    return false;
  }

  getPageLogonRequired(): boolean {
    return false;
  }
}
