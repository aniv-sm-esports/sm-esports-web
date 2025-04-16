import { Request, Response} from 'express-serve-static-core';
import {ApiData, ApiResponse, ApiResponseType} from '../../app/model/service/app.model';
import {DataModel} from '../model/server.datamodel';
import {ParsedQs} from 'qs';
import {UserCredentials, UserJWT, UserJWTPayload} from '../../app/model/repository/user-logon.model';
import {User} from '../../app/model/repository/user.model';

import {AuthService} from '../service/auth.service';
import {PageData} from '../../app/model/service/page.model';
import {RepositoryEntity} from '../../app/model/repository/repository-entity';
import {SearchModel} from '../../app/model/service/search.model';


export abstract class BaseController {

  // *** Server-Wide JWT instance ***
  //
  protected readonly authService: AuthService;
  protected readonly serverDb: DataModel;


  // User for this request (or not defined if not stored with express-jwt)
  protected requestUser:User = User.default();
  protected requestJWT:UserJWT = UserJWT.default();
  protected logonRequired:boolean = false;

  constructor(serverDb: DataModel, authService: AuthService) {
    this.authService = authService;
    this.serverDb = serverDb;

    this.initialize();
  }

  // Must call initialize from super class!
  protected abstract initialize():void;

  protected setLogonRequired(value:boolean) {
    this.logonRequired = value;
  }

  // Middleware Pipeline ->
  //
  // -> Authenticate: Log Url, Decode Bearer Token, Lookup User (stores for this request)
  // -> (Work): Primary work method
  // -> Send: ApiResponse<T>
  //

  // Authenticate: This will try and retrieve the JWT credentials stored by
  // looking at the JWT bearer token headers. If there is information present,
  // the User will be passed along with the controller's work load.
  //
  authenticate(request: Request<{}, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>, number>) {

    // Internal Failure
    if (!request) {
      console.log('Server Request not properly formed!');
      return;
    }

    // Show URL
    console.log(`Server Request:  ${request?.url}`);

    try {

      // Reset Session Data
      this.requestUser = User.default();
      this.requestJWT = UserJWT.default();

      // NOTE*****  The "Bearer undefined" value should not be hard coded, here. The middle ware is having
      //            problems somewhere in jwt.verify; and it is swallowing exceptions.

      // No Headers Present
      if (!request.headers.authorization ||
        request.headers.authorization == 'Bearer undefined') {
        return;
      }

      else {

        // Verify
        let payload = this.authService.verify(request.headers.authorization.replace('Bearer ', ''));

        // Default (User Not Logged On)
        if (!payload) {
          this.requestUser = User.default();
          this.requestJWT = UserJWT.default();
          console.log("User Defaulted");
        }

        // SUCCESS
        else {
          this.requestUser = this.serverDb.users.getFirst(SearchModel.fromMap<User>({ "userName": payload.userName})) || User.default();
          this.requestJWT = UserJWT.fromLogon(payload.userName, request.headers.authorization || '',
            payload.loginTime,
            payload.expirationTime);

          console.log("User Verified " + payload.userName);
        }

        /*
        // Retrieve token
        let decrypted = this.jwt.verify(request.headers.authorization, this.PUBLIC_KEY, {
          algorithms: ['HS256']
        }) as JwtPayload;

        // Identify the server's User / JWT to complete authentication
        if (decrypted.sub) {

          // Check expiration
          if (moment().isAfter(moment(decrypted.exp).add(decrypted.iat, 'hours'))) {

            // RESET LOGON INFORMATION - WILL PROMPT NEW JWT.
            this.requestUser = User.default();
            this.requestJWT = UserJWT.default();

            console.log('Server Request (JWT): Login has expired');
          }

          // SUCCESS
          else {
            this.requestUser = this.serverDb.getUserByName(decrypted.sub);
            this.requestJWT = UserJWT.fromLogon(decrypted.sub, request.headers.authorization || '',
              moment(decrypted.iat).toDate(),
              moment(decrypted.exp).toDate());
          }
        }
        */
      }
    }
    catch (error) {

      // RESET LOGON INFORMATION - WILL PROMPT NEW JWT.
      this.requestUser = User.default();
      this.requestJWT = UserJWT.default();

      console.log('Server Request Error: Could not verify user from auth headers (usually this means the JWT token has expired)');
      console.log(error);
    }
  }
}
