import {Injectable} from '@angular/core';
import {User} from '../../app/model/user.model';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';

@Injectable({
  providedIn: 'root'
})
export class UserController extends BaseController {

  // GET -> /api/users/get/:userId
  //
  get(request: Request<{userName:string}, any, any, ParsedQs, Record<string, any>>,
      response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      let user= this.serverDb.getUserByName(request.params.userName);

      // Success
      if (user) {
        this.sendSuccess(response, user || User.default());
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

  // GET -> /api/users/getAll
  //
  getAll(request: Request<{}, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    try {
      let users:User[] = [];

      this.serverDb.users.forEach((user:User) => {
        users.push(user);
      })

      // Success
      this.sendSuccess(response, users);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // GET -> /api/users/create/:userName
  //
  create(request: Request<{ userName: string; }, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    // Parameter Validation -> Failure
    if (!request.params.userName) {
      this.sendDataError(response, 'User name not specified');
      return;
    }

    // Parameter Validation -> Failure
    if (request.params.userName.trim() == '') {
      this.sendDataError(response, 'User name not specified');
      return;
    }

    try {

      let success = true;

      // Exists
      this.serverDb.users.forEach((user:User) => {
        if (user.name == request.params.userName.trim()) {
          success = false;
          this.sendDataError(response, 'User already exists - Please try a different user name');
        }
      });

      // Already exists -> return
      if (!success) {
        return;
      }

      // Add User
      let userId = this.serverDb.users.size;

      this.serverDb.users.set(userId, User.from(userId, request.params.userName.trim()));

      // Success
      this.sendSuccess(response, this.serverDb.users.get(userId));
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // GET -> /api/users/exists/:userName
  //
  exists(request: Request<{ userName: string; }, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    // Parameter Validation -> Failure
    if (!request.params.userName) {
      this.sendDataError(response, 'User name not specified');
      return;
    }

    // Parameter Validation -> Failure
    if (request.params.userName.trim() == '') {
      this.sendDataError(response, 'User name not specified');
      return;
    }

    let result:boolean = false;
    let success:boolean = false;
    let message:string = '';

    try {

      this.serverDb.users.forEach((user:User) => {
        if (user.name == request.params.userName.trim()) {
          result = true;
        }
      });

      success = true;
    }
    catch(error) {
      console.log(error);
      success = false;
      message = 'An Error has occurred: See server log for details';
    }

    if (success) {
      this.sendSuccess(response, result);
    }
    else {
      this.sendError(response, message);
    }
  }
}
