import { Request, Response} from 'express-serve-static-core';
import {ApiResponse, ApiResponseType} from '../../app/model/app.model';
import {DataModel} from '../model/server.datamodel';
import {ParsedQs} from 'qs';
import {UserCredentials, UserJWT, UserJWTPayload} from '../../app/model/user-logon.model';
import moment from 'moment';
import {User} from '../../app/model/user.model';

import CryptoJS from 'crypto-js';
import {AuthService} from '../service/auth.service';
import {PageData} from '../../app/model/page.model';


export class BaseController {

  // *** Server-Wide JWT instance ***
  //
  protected readonly authService: AuthService;
  protected readonly serverDb: DataModel;


  // User for this request (or not defined if not stored with express-jwt)
  protected requestUser:User = User.default();
  protected requestJWT:UserJWT = UserJWT.default();
  private logonRequired:boolean = false;

  constructor(serverDb: DataModel, authService: AuthService) {
    this.authService = authService;
    this.serverDb = serverDb;
  }

  protected setLogonRequired(value:boolean) {
    this.logonRequired = value;
  }

  private initApiResponse<T>(pageData:PageData | undefined) {

    let apiResponse: ApiResponse<T>;

    // Logon Required / User Authenticated
    if (this.logonRequired && this.requestUser) {
      apiResponse =
        ApiResponse
          .initLogonRequired<T>()
          .setPageData<T>(pageData)
          .loggedOn<T>(this.requestJWT || UserJWT.default());
    }

    // Logon Required / User NOT Authenticated
    else if (this.logonRequired && !this.requestUser) {
      apiResponse =
        ApiResponse
          .initLogonRequired<T>()
          .setPageData<T>(pageData)
          .notLoggedOn<T>();
    }

    // Logon Not Required / User Authenticated
    else if (!this.logonRequired && this.requestUser) {
      apiResponse =
        ApiResponse
          .initLogonNotRequired<T>()
          .setPageData<T>(pageData)
          .loggedOn<T>(this.requestJWT || UserJWT.default());
    }

    // Logon Not Required / User Not Authenticated
    else {
      apiResponse =
        ApiResponse
          .initLogonNotRequired<T>()
          .setPageData<T>(pageData)
          .notLoggedOn<T>();
    }

    return apiResponse;
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
          this.requestUser = this.serverDb.getUserByName(payload.userName);
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

  // Sends Response: This will send one ApiResponse<T> for the controller
  //
  protected sendSuccess<T>(response: Response<any, Record<string, any>, number>, data:T, pageData:PageData | undefined) {

    console.log('Server Response: Success');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse<T>(pageData);

    // Logon Required
    if (!apiResponse.logonMet())
      response.send(apiResponse.logonRequired());

    // Success
    else
      response.send(apiResponse.success(data));
  }
  protected sendLogonRequired<T>(response: Response<any, Record<string, any>, number>) {

    console.log('Server Response: Logon Required');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse<T>(undefined);

    // Logon Required
    response.send(apiResponse.logonRequired());
  }
  protected sendPermissionRequired<T>(response: Response<any, Record<string, any>, number>) {

    console.log('Server Response: Permission Required');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse<T>(undefined);

    // Permission Required
    response.send(apiResponse.permissionRequired());
  }
  protected sendDataError<T>(response: Response<any, Record<string, any>, number>, data:T | undefined, message:string) {

    console.log('Server Response: Input Data Error');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse<T>(undefined);

    // Input Data Error
    response.send(apiResponse.inputDataError(data, message));
  }
  protected sendError<T>(response: Response<any, Record<string, any>, number>, message:string) {

    console.log('Server Response: Server Error');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse<T>(undefined);

    // Send success
    response.send(apiResponse.serverError(message));
  }

}
