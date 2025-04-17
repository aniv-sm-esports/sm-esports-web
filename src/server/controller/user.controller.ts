import {Injectable} from '@angular/core';
import {User} from '../../app/model/repository/user.model';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {RepositoryController} from './repository.controller';
import {ApiData, ApiRequest, ApiResponse} from '../../app/model/service/app.model';
import {UserCreation} from '../../app/model/view/user-creation.model';
import {UserCredentials} from '../../app/model/service/user-logon.model';
import {PageData} from '../../app/model/service/page.model';
import {SearchModel} from '../../app/model/service/search.model';
import {Repository} from '../../app/model/repository/repository.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';

export class UserController extends RepositoryController<User> {

  private repository:Repository<User> = Repository.default<User>();

  constructor(serverDb: DataModel, authService: AuthService) {
    super(serverDb, authService);
    this.initialize();
  }

  // Called from super()
  initialize() {
    this.repository = this.serverDb.users;
  }

  // GET -> /api/users/get/:userId
  //
  get(request: Request<{userName:string}, any, any, ParsedQs, Record<string, any>>,
      response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      // No filter validation required. Just get the matching user.
      let user= this.repository.getFirst(SearchModel.fromMap({ "userName": request.params.userName }));

      // API Data
      let apiData = ApiData.fromSingle<User>(user || User.default());

      // Success
      if (user) {
        this.sendSuccess(response, apiData, undefined);
        return;
      }
      else {
        this.sendDataError(response, "User not found:  " + request.params.userName);
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/users/getPage
  //
  getPage(request: Request<{}, ApiResponse<User>, ApiRequest<User>, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      // Spawn Filtered Child Repository
      let repository:Repository<User> = this.repository.createChild(request.body.repositoryState.filter) as Repository<User>;

      // Update Repository Data
      let pageData = request.body.pageData || PageData.firstPage(25);

      // Get Page of Users
      let users:User[] = repository.getPage(pageData) || [];

      // API Data
      let apiData = ApiData.fromSet<User>(users);

      // Success
      this.sendSuccess(response, apiData, pageData);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
