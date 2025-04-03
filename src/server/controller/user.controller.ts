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
  get(request: Request<{userId:string}, any, any, ParsedQs, Record<string, any>>,
      response: Response<any, Record<string, any>, number>) {

    this.logRequest(request);

    let user:User = User.default();
    let message:string = '';

    try {

      // Success
      if (this.serverDb.users.has(Number(request.params.userId))) {

        user = this.serverDb.users.get(Number(request.params.userId)) || User.default();

        // Send during try/catch
        this.logResponseSuccess(response, user);
        return;
      }
      else {
        message = `User not found:  ${request.params.userId}`;
      }
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }

  // GET -> /api/users/getAll
  //
  getAll(request: Request<{}, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    this.logRequest(request);

    let message:string = '';

    try {
      let users:User[] = [];

      this.serverDb.users.forEach((user:User) => {
        users.push(user);
      })

      // Success
      this.logResponseSuccess(response, users);
      return;
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }

  // GET -> /api/users/create/:userName
  //
  create(request: Request<{ userName: string; }, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    this.logRequest(request);

    // Parameter Validation -> Failure
    if (!request.params.userName) {
      this.logResponseFail(response, 'User name not specified');
      return;
    }

    // Parameter Validation -> Failure
    if (request.params.userName.trim() == '') {
      this.logResponseFail(response, 'User name not specified');
      return;
    }

    // Mark success to look for existing (true)
    let success:boolean = true;
    let message:string = '';

    try {

      // Exists
      this.serverDb.users.forEach((user:User) => {
        if (user.name == request.params.userName.trim()) {
          success = false;
          message = 'User already exists - Please try a different user name';
        }
      });

      // Already exists -> return
      if (!success) {
        this.logResponseFail(response, message);
        return;
      }

      // Add User
      let userId = this.serverDb.users.size;

      this.serverDb.users.set(userId, new User(userId, request.params.userName.trim()));

      // Success
      success = true;
      message = 'User created successfully';
      this.logResponseSuccess(response, message);
      return;
    }
    catch(error) {
      console.log(error);
      success = false;
      message = 'An Error has occurred: See server log for details';
    }

    this.logResponseFail(response, message);
  }

  // GET -> /api/users/exists/:userName
  //
  exists(request: Request<{ userName: string; }, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    this.logRequest(request);

    // Parameter Validation -> Failure
    if (!request.params.userName) {
      this.logResponseFail(response, 'User name not specified');
      return;
    }

    // Parameter Validation -> Failure
    if (request.params.userName.trim() == '') {
      this.logResponseFail(response, 'User name not specified');
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
      this.logResponseSuccess(response, result);
    }
    else {
      this.logResponseFail(response, message);
    }

  }
}
