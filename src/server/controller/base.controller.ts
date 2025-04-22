import { Request, Response} from 'express-serve-static-core';
import {DataModel} from '../model/server.datamodel';
import {ParsedQs} from 'qs';
import {UserCredentials, UserJWT, UserJWTPayload} from '../../app/model/service/user-logon.model';
import {User} from '../../app/model/repository/entity/user.model';

import {AuthService} from '../service/auth.service';
import {PageData} from '../../app/model/service/page.model';
import {RepositoryEntity} from '../../app/model/repository/repository-entity';
import {SearchModel} from '../../app/model/repository/search.model';


export abstract class BaseController {

  // *** Server-Wide JWT instance ***
  //
  protected readonly authService: AuthService;
  protected readonly serverDb: DataModel;

  protected abstract getName():string;
  public abstract clone(): BaseController;

  constructor(serverDb: DataModel, authService: AuthService) {
    this.authService = authService;
    this.serverDb = serverDb;
  }
}
