import { Request, Response} from 'express-serve-static-core';
import {ApiResponse, ApiResponseType} from '../../app/model/app.model';
import {DataModel} from '../model/server.datamodel';
import {ParsedQs} from 'qs';
import {Injectable} from '@angular/core';
import {expressjwt} from 'express-jwt';
import * as fs from 'node:fs';
import * as jwt from 'jsonwebtoken';
import {UserCredentials, UserJWT, UserJWTPayload} from '../../app/model/user-logon.model';
import moment from 'moment';
import {NextFunction} from 'express';
import {User} from '../../app/model/user.model';
import { JwtPayload } from 'jsonwebtoken';

@Injectable({
  providedIn: 'root'
})
export class BaseController {

  // *** Server-Wide JWT instance ***
  //
  protected static readonly PUBLIC_KEY:string = fs.readFileSync('public.key', 'utf-8');
  protected static readonly expressJWT = expressjwt({
    secret: BaseController.PUBLIC_KEY,
    algorithms: ['HS256']
  });

  // User for this request (or not defined if not stored with express-jwt)
  protected requestUser:User = User.default();
  protected requestJWT:UserJWT = UserJWT.default();
  private logonRequired:boolean = false;

  constructor(protected readonly serverDb: DataModel) {

  }

  protected setLogonRequired(value:boolean) {
    this.logonRequired = value;
  }

  private initApiResponse<T>() {

    let apiResponse: ApiResponse<T>;

    // Logon Required / User Authenticated
    if (this.logonRequired && this.requestUser) {
      apiResponse =
        ApiResponse
          .initLogonRequired<T>()
          .loggedOn<T>(this.requestJWT || UserJWT.default());
    }

    // Logon Required / User NOT Authenticated
    else if (this.logonRequired && !this.requestUser) {
      apiResponse =
        ApiResponse
          .initLogonRequired<T>()
          .notLoggedOn<T>();
    }

    // Logon Not Required / User Authenticated
    else if (!this.logonRequired && this.requestUser) {
      apiResponse =
        ApiResponse
          .initLogonNotRequired<T>()
          .loggedOn<T>(this.requestJWT || UserJWT.default());
    }

    // Logon Not Required / User Not Authenticated
    else {
      apiResponse =
        ApiResponse
          .initLogonNotRequired<T>()
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

        // NOTE SURE HOW THIS IS USUALLY DONE! ('Bearer ') seems consistent!
        let token = request.headers.authorization.replace('Bearer ', '');

        // Retrieve token
        let decrypted = jwt.verify(token, BaseController.PUBLIC_KEY, {
          algorithms: ['HS256']
        }) as JwtPayload;

        // Identify the server's User / JWT to complete authentication
        if (decrypted.sub) {
          this.requestUser = this.serverDb.getUserByName(decrypted.sub);
          this.requestJWT = UserJWT.fromLogon(decrypted.sub, request.headers.authorization || '',
                                              moment(decrypted.iat).toDate(),
                                              moment(decrypted.exp).toDate());
        }
      }
    }
    catch (error) {

      //TODO: BOOT THE CREDENTIALS TO PREVENT FALSE VALIDATION!!!!!!!

      console.log('Server Request Error: Could not verify user from auth headers (usually this means the JWT token has expired)');
    }
  }

  // Signs User Credentials:  Creates JWT bearer token information using express-jwt
  //
  protected sign(credentials:UserCredentials) {

    // Create payload to store user name and logon time
    //
    let payload:UserJWTPayload = new UserJWTPayload(credentials.userName, moment().toDate(), moment().add(120, 'minutes').toDate());

    let jwtBearerToken = jwt.sign({}, BaseController.PUBLIC_KEY, {
      algorithm: 'HS256',
      expiresIn: 120,
      subject: credentials.userName
    });

    return UserJWT.fromLogon(credentials.userName, jwtBearerToken, payload.loginTime, payload.expirationTime);
  }

  // Sends Response: This will send one ApiResponse<T> for the controller
  //
  protected sendSuccess<T>(response: Response<any, Record<string, any>, number>, data:T) {

    console.log('Server Response: Success');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse<T>();

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
    let apiResponse = this.initApiResponse<T>();

    // Logon Required
    response.send(apiResponse.logonRequired());
  }
  protected sendPermissionRequired<T>(response: Response<any, Record<string, any>, number>) {

    console.log('Server Response: Permission Required');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse<T>();

    // Permission Required
    response.send(apiResponse.permissionRequired());
  }
  protected sendDataError<T>(response: Response<any, Record<string, any>, number>, message:string) {

    console.log('Server Response: Input Data Error');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse<T>();

    // Input Data Error
    response.send(apiResponse.inputDataError(message));
  }
  protected sendError<T>(response: Response<any, Record<string, any>, number>, message:string) {

    console.log('Server Response: Server Error');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse<T>();

    // Send success
    response.send(apiResponse.serverError(message));
  }

}
