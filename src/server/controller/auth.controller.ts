import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {ApiResponse} from '../../app/model/app.model';
import {UserCredentials, UserJWT} from '../../app/model/user-logon.model';


@Injectable({
  providedIn: 'root'
})
export class AuthController extends BaseController {

  // GET -> /api/users/get/:userId
  //
  logon(request: Request<{}, ApiResponse<UserJWT>, UserCredentials, ParsedQs, Record<string, any>>,
        response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    // Validate User Data
    if (!request.body.userName ||
         request.body.userName.trim() == '') {
      this.sendDataError(response, 'User name is not valid');
      return;
    }

    try {

      // User Lookup
      let user= this.serverDb.getUserByName(request.body.userName || '');

      // User Found
      if (user && this.serverDb.credentials.has(user.id)) {

        let userCredentials = this.serverDb.credentials.get(user?.id || 0);

        // Failure
        if (request.body.password != userCredentials?.password) {

          // Mark Unauthorized
          response.status(401);

          // Response with message + empty token
          this.sendDataError(response, 'Password invalid');
          return;
        }

        // JWT Token
        let userJWT = this.sign(userCredentials);

        // Success -> Send JWT Token
        this.sendSuccess(response, userJWT);
      }

      // User Not Found
      else {
        this.sendDataError(response, 'User not found');
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
