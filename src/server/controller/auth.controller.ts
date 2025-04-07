import {Injectable} from '@angular/core';
import {User} from '../../app/model/user.model';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {UserLogon} from '../../app/model/user-logon.model';
import * as jwt from 'jsonwebtoken';
import * as fs from 'node:fs';
import {ApiResponse} from '../../app/model/app.model';


@Injectable({
  providedIn: 'root'
})
export class AuthController extends BaseController {

  // JWT Public Key
  //
  private readonly RSA_PUBLIC_KEY:Buffer = fs.readFileSync('public.key');

  // GET -> /api/users/get/:userId
  //
  logon(request: Request<{}, ApiResponse<UserLogon>, UserLogon, ParsedQs, Record<string, any>>,
        response: Response<any, Record<string, any>, number>) {

    this.logRequest(request);

    // Validate User Data
    if (!request.body.userName ||
         request.body.userName.trim() == '') {
      this.logResponseFail(response, 'User information invalid');
      return;
    }

    let message:string = '';

    try {

      // User Lookup
      let user= this.serverDb.getUserByName(request.body.userName || '');

      // User Found
      if (user) {

        if (request.body.password != user?.password) {

          // Mark Unauthorized
          response.status(401);

          this.logResponseFail(response, 'Password incorrect');
          return;
        }

        // JWT Token
        const jwtBearerToken = jwt.sign({}, this.RSA_PUBLIC_KEY, {
          algorithm: 'RS256',
          expiresIn: 120,
          subject: user.name
        });

        let logonResponse:UserLogon = new UserLogon();
        logonResponse.userName = user.name;
        logonResponse.password = user.password;
        logonResponse.logonTime = new Date();
        logonResponse.token = jwtBearerToken;

        // Success -> Send JWT Token
        this.logResponseSuccess(response, logonResponse);
        return;
      }

      // User Not Found
      else {
        message = `User not found:  ${request.body.userName}`;
      }
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }
}
