import { Request, Response} from 'express-serve-static-core';
import {ApiData, ApiResponse, ApiResponseType} from '../../app/model/service/app.model';
import {DataModel} from '../model/server.datamodel';
import {UserCredentials, UserJWT, UserJWTPayload} from '../../app/model/service/user-logon.model';

import {AuthService} from '../service/auth.service';
import {PageData} from '../../app/model/service/page.model';
import {RepositoryEntity} from '../../app/model/repository/repository-entity';
import {BaseController} from './base.controller';


export abstract class RepositoryController<T extends RepositoryEntity> extends BaseController {

  constructor(serverDb: DataModel, authService: AuthService) {
    super(serverDb, authService);
    this.initialize();
  }

  private initApiResponse(pageData:PageData | undefined) {

    let apiResponse: ApiResponse<T>;

    // Logon Required / User Authenticated
    if (this.logonRequired && this.requestUser) {
      apiResponse =
        ApiResponse
          .initLogonRequired<T>()
          .setPageData(pageData)
          .loggedOn(this.requestJWT || UserJWT.default());
    }

    // Logon Required / User NOT Authenticated
    else if (this.logonRequired && !this.requestUser) {
      apiResponse =
        ApiResponse
          .initLogonRequired<T>()
          .setPageData(pageData)
          .notLoggedOn();
    }

    // Logon Not Required / User Authenticated
    else if (!this.logonRequired && this.requestUser) {
      apiResponse =
        ApiResponse
          .initLogonNotRequired<T>()
          .setPageData(pageData)
          .loggedOn(this.requestJWT || UserJWT.default());
    }

    // Logon Not Required / User Not Authenticated
    else {
      apiResponse =
        ApiResponse
          .initLogonNotRequired<T>()
          .setPageData(pageData)
          .notLoggedOn();
    }

    return apiResponse;
  }

  // Middleware Pipeline ->
  //
  // -> Authenticate: Log Url, Decode Bearer Token, Lookup User (stores for this request)
  // -> (Work): Primary work method
  // -> Send: ApiResponse<T>
  //

  // Sends Response: This will send one ApiResponse<T> for the controller
  //
  protected sendSuccess(response: Response<any, Record<string, any>, number>, apiData:ApiData<T>, pageData:PageData | undefined) {

    console.log('Server Response: Success');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse(pageData);

    // Data
    apiResponse.setData(apiData);

    // Logon Required
    if (!apiResponse.logonMet()) {
      response.send(apiResponse.logonRequired());
    }

    // Success
    else {
      response.send(apiResponse.success());
    }
  }
  protected sendLogonRequired(response: Response<any, Record<string, any>, number>) {

    console.log('Server Response: Logon Required');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse(undefined);

    // Logon Required
    response.send(apiResponse.logonRequired());
  }
  protected sendPermissionRequired(response: Response<any, Record<string, any>, number>) {

    console.log('Server Response: Permission Required');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse(undefined);

    // Permission Required
    response.send(apiResponse.permissionRequired());
  }
  protected sendDataError(response: Response<any, Record<string, any>, number>, message:string) {

    console.log('Server Response: Input Data Error');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse(undefined);

    // Input Data Error
    response.send(apiResponse.inputDataError(message));
  }
  protected sendError(response: Response<any, Record<string, any>, number>, message:string) {

    console.log('Server Response: Server Error');

    // Set logon data for ApiResponse
    let apiResponse = this.initApiResponse(undefined);

    // Send success
    response.send(apiResponse.serverError(message));
  }
}
