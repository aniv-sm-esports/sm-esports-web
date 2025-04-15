import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {ApiResponse} from '../../app/model/app.model';
import {UserCredentials, UserJWT} from '../../app/model/user-logon.model';
import {Chat} from '../../app/model/chat.model';


export class AuthController extends BaseController {

  // POST -> /api/login
  //
  logon(request: Request<{}, ApiResponse<UserJWT>, UserCredentials, ParsedQs, Record<string, any>>,
        response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    // Validate User Data
    if (!request.body.userName ||
         request.body.userName.trim() == '') {
      this.sendDataError(response, UserJWT.default(), 'User name is not valid');
      return;
    }

    try {

      // User Lookup
      let user= this.serverDb.getUserByName(request.body.userName || '');

      // User Found
      if (user && this.serverDb.credentials.some(userCred => userCred.userName == user.name)) {

        let userCredentials = this.serverDb.credentials.find(userCred => userCred.userName == user.name);

        // Failure
        if (request.body.password != userCredentials?.password) {

          // Mark Unauthorized
          response.status(401);

          // Response with message + empty token
          this.sendDataError(response, UserJWT.default(), 'Password invalid');
          return;
        }

        // JWT Token
        let userJWT = this.authService.logon(userCredentials);

        // Success -> Send JWT Token
        this.sendSuccess(response, userJWT, undefined);
      }

      // User Not Found
      else {
        this.sendDataError(response, UserJWT.default(), 'User not found');
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // GET -> /api/login/getSession
  //
  getSession(request: Request<{}, ApiResponse<UserJWT>, any, ParsedQs, Record<string, any>>,
             response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(true);

    try {

      // Success -> Send JWT Token
      if (!this.requestJWT.isDefault())
        this.sendSuccess(response, this.requestJWT, undefined);

      // User Not Found
      else {
        this.sendError(response, 'User not logged in!');
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
