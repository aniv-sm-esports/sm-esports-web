import {Request, Response} from 'express-serve-static-core';
import {ApiData, ApiRequest, ApiResponse} from '../../app/model/service/app.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {RepositoryEntity} from '../../app/model/repository/repository-entity';
import {BaseController} from './base.controller';
import {SearchModel} from '../../app/model/repository/search.model';
import {ParsedQs} from 'qs';
import {Repository, RepositoryPageAvailability} from '../../app/model/repository/repository.model';
import {RepositoryServer} from '../../app/model/repository/repository-server.model';
import {RepositoryState} from '../../app/model/repository/repository-state.model';
import {Predicate} from '../../app/model/service/handler.model';
import {RepositoryStateDiffer} from '../../app/model/repository/repository-state-differ.model';
import { RepositoryStateData } from '../../app/model/repository/repository-state-data.model';
import moment from 'moment';
const {styleText} = require('node:util');

export abstract class RepositoryController<T extends RepositoryEntity> extends BaseController {

  // NOTE*** This should be a read-only repository; but there is an initialize() problem which
  //         must take data, first, before choosing the actual repository from the DataModel.
  //
  protected repository!:RepositoryServer<T>;
  protected defaultEntity!:T;

  // Primary Repository implies that it is the primary parent (master records) which should be
  // in sync with the database.
  protected isPrimaryRepository:boolean = false;

  // Repository controller must be initialized before using
  protected initialized:boolean = false;

  protected constructor(serverDb: DataModel, authService: AuthService, isPrimaryRepository:boolean) {
    super(serverDb, authService);

    this.isPrimaryRepository = isPrimaryRepository;
  }

  public abstract override initialize():void;
  public override getName() { return this.getEntityName(); }
  public abstract getEntityName():string;
  public abstract getLogonRequired():boolean;
  public abstract getByIdLogonRequired():boolean;
  public abstract getPageLogonRequired():boolean;

  public createChild(childState:RepositoryState<T>) {

    if (!this.initialized) {
      console.log("Error: Trying to use repository controller before calling initialize");
      return;
    }

    return this.repository.createChild(childState.getFilter());
  }

  // Server-Side search function
  public search(predicate:Predicate<T>){

    if (!this.initialized) {
      console.log("Error: Trying to use repository controller before calling initialize");
      return [];
    }

    return this.repository.where(predicate);
  }

  public first(predicate:Predicate<T>){

    if (!this.initialized) {
      console.log("Error: Trying to use repository controller before calling initialize");
      return;
    }

    return this.repository.first(predicate);
  }

  // NOTE**** This Design Requires Session Persistence!!
  //
  // Design:  The server keeps a cache of repositories; and creates child repositories
  //          for temporary searching and paging. These are created by the primary
  //          server application code (server.ts); and stored there. These methods are
  //          to support the getting of data after the client is synchronized (by state).
  //
  // Example:  Client -> GetRepositoryState -> (returns the latest state, which is just a
  //           fingerprint of the current server repository)
  //
  //           (then) Client -> Get -> (returns a page of results)
  //
  // Example:  Client -> PostRepositoryState -> (forces server to spawn a new filter instance
  //           per user / per entity). Then, the client queries that
  //
  // get:      Returns a (filtered) page of records.
  //
  // getAll:   Returns the entire collection of records.
  //
  // create:   Creates a new entity, which invalidates the server-client synchronization. So,
  //           the ApiResponse contains the latest (new) RepositoryState (state).
  //

  // LOGGING:
  //
  // console.log(styleText('green', 'Server is running...'));
  // console.log(styleText(['underline', 'italic', 'magenta'], 'Underlined message'));
  // console.log(styleText('bgCyan', 'Background color'));
  // console.log(styleText('dim', 'Dim message'));
  //

  // TODO: FINISH TYPE DECORATORS / SERIALIZATION
  public static stateToString<T extends RepositoryEntity>(state:RepositoryStateData<T>):string {
    return `((${state.repositoryKey}), (${state.entityName}), (${state.filterSearchSettings}), (${state.filteredRecordCapacity}), (${state.unfilteredRecordCapacity}), INVAILD(${state.invalid}))`;
  }

  public preWorkLog(request: Request<{}, ApiResponse<T>, ApiRequest<T>, ParsedQs, Record<string, any>>,
                    response: Response<ApiResponse<T>, Record<string, any>, number>) {

    let serverState = RepositoryController.stateToString(this.repository.cloneState());
    let clientState = RepositoryController.stateToString(request.body.repositoryState);
    let diff = RepositoryStateDiffer.stateDataDiff(this.repository.cloneState(), request.body.repositoryState);

    console.log(styleText(['cyan'], moment().format('YYYY-MM-DD hh:mm:ss:SSSS') + "  Server State:  " + serverState));
    console.log(styleText(['cyan'], moment().format('YYYY-MM-DD hh:mm:ss:SSSS') + "  Client State:  " + clientState));
    console.log(styleText([diff ? 'redBright' : 'greenBright'], moment().format('YYYY-MM-DD hh:mm:ss:SSSS') + "  Diff State:    " + (diff ? "(Failed)" : "(Success)")));
  }

  public getState(request: Request<{}, ApiResponse<T>, ApiRequest<T>, ParsedQs, Record<string, any>>,
                  response: Response<ApiResponse<T>, Record<string, any>, number>) {

    if (!this.initialized) {
      console.log("Error: Trying to use repository controller before calling initialize");
      return;
    }

    this.preWorkLog(request, response);

    // CHECK INVAILD STATUS!
    if (this.repository.getInvalid()) {
      this.sendError(response, "Server Internal Error:  Trying to use repository in an invalid state!");
      return;
    }

    // RepositoryState:  Sent back with all response types.
    this.sendSuccess(response, ApiData.default());
  }

  // MAY NOT NEED EXTRA FUNCTION! Depends on how the initial page is sent back.
  public checkState(request: Request<{}, ApiResponse<T>, ApiRequest<T>, ParsedQs, Record<string, any>>,
                    response: Response<ApiResponse<T>, Record<string, any>, number>) {

    if (!this.initialized) {
      console.log("Error: Trying to use repository controller before calling initialize");
      return;
    }

    this.preWorkLog(request, response);

    // CHECK INVAILD STATUS!
    if (this.repository.getInvalid()) {
      this.sendError(response, "Server Internal Error:  Trying to use repository in an invalid state!");
      return;
    }

    // RepositoryState:  Sent back with all response types.
    this.sendSuccess(response, ApiData.default());
  }

  public get(request: Request<{}, ApiResponse<T>, ApiRequest<T>, ParsedQs, Record<string, any>>,
             response: Response<ApiResponse<T>, Record<string, any>, number>) {

    if (!this.initialized) {
      console.log("Error: Trying to use repository controller before calling initialize");
      return;
    }

    this.preWorkLog(request, response);

    // Validate State!
    if (RepositoryStateDiffer.stateDataDiff(this.repository.cloneState(), request.body.repositoryState))  {
      this.sendDataError(response, "Error:  Repository State Differs! Sending updated state (in response body)");
      return;
    }

    // CHECK INVAILD STATUS!
    if (this.repository.getInvalid()) {
      this.sendError(response, "Server Internal Error:  Trying to use repository in an invalid state!");
      return;
    }

    try {

      // Check paging
      let pageCheck = this.repository.contains(request.body.pageData);

      // Page Error
      if (pageCheck == RepositoryPageAvailability.None ||
          pageCheck == RepositoryPageAvailability.Invalid) {
        this.sendDataError(response, "Error:  Request repository page out of range");
        return;
      }

      // No filter validation required. Just get the page of results.
      let entities= this.repository.getPage(request.body.pageData) || [];

      // API Data
      let apiData = new ApiData(entities);

      // Success
      this.sendSuccess(response, apiData);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  public getAll(request: Request<{}, ApiResponse<T>, ApiRequest<T>, ParsedQs, Record<string, any>>,
                response: Response<ApiResponse<T>, Record<string, any>, number>) {

    if (!this.initialized) {
      console.log("Error: Trying to use repository controller before calling initialize");
      return;
    }

    this.preWorkLog(request, response);

    // Validate State!
    if (RepositoryStateDiffer.stateDataDiff(this.repository.cloneState(), request.body.repositoryState)) {
      this.sendDataError(response, "Error:  Repository State Differs! Sending updated state (in response body)");
      return;
    }

    // CHECK INVAILD STATUS!
    if (this.repository.getInvalid()) {
      this.sendError(response, "Server Internal Error:  Trying to use repository in an invalid state!");
      return;
    }

    try {

      // No filter validation required. Just get the page of results.
      let entities= this.repository.getAll() || [];

      // API Data
      let apiData = new ApiData(entities);

      // Success
      this.sendSuccess(response, apiData);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  public create(request: Request<{}, ApiResponse<T>, ApiRequest<T>, ParsedQs, Record<string, any>>,
                response: Response<ApiResponse<T>, Record<string, any>, number>) {

    if (!this.initialized) {
      console.log("Error: Trying to use repository controller before calling initialize");
      return;
    }

    this.preWorkLog(request, response);

    // BASE REPOSITORY ONLY! (UNFILTERED!)
    if (!this.isPrimaryRepository) {
      this.sendError(response, "Server Internal Error:  Trying to add entity record to a child-repository!");
      return;
    }

    // CHECK INVAILD STATUS!
    if (this.repository.getInvalid()) {
      this.sendError(response, "Server Internal Error:  Trying to use repository in an invalid state!");
      return;
    }

    // Validate New Entity
    if (request.body.requestData.data.length != 1) {
      this.sendDataError(response, "Invalid Request:  Must send a single entity to insert into the repository");
      return;
    }

    try {

      // Should be ok, since repository is valid.
      let entityId = this.repository.getNextId();

      // Valid New Entity
      let entity = request.body.requestData.data[0] as T;

      // Assign new id (will be done by DB)
      entity.id = entityId;

      // TODO: ADD TO DATABASE, RE-VALIDATE DATA SET
      this.repository.append(entity, false, false);

      // API Data
      let apiData = new ApiData([entity]);

      // Success
      this.sendSuccess(response, apiData);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // Middleware Pipeline ->
  //
  // -> Authenticate: Log Url, Decode Bearer Token, Lookup User (stores for this request)
  // -> (Work): Primary work method
  // -> Send: ApiResponse<T>
  //

  // Sends Response: This will send one ApiResponse<T> for the controller
  //
  protected sendSuccess(response: Response<ApiResponse<T>, Record<string, any>, number>, apiData:ApiData<T>) {

    console.log('Server Response: Success');

    // Set logon data for ApiResponse
    let apiResponse = ApiResponse.init<T>(this.repository.cloneState());

    // Data
    apiResponse.setData(apiData);

    // Logon Required
    if (!apiResponse.logonMet()) {
      response.send(apiResponse.logonRequired(true));
    }

    // Success
    else {
      response.send(apiResponse.success());
    }
  }
  protected sendLogonRequired(response: Response<ApiResponse<T>, Record<string, any>, number>) {

    console.log('Server Response: Logon Required');

    // Set logon data for ApiResponse
    let apiResponse = ApiResponse.init(this.repository.cloneState());

    // Logon Required
    response.send(apiResponse.logonRequired(true));
  }
  protected sendPermissionRequired(response: Response<ApiResponse<T>, Record<string, any>, number>) {

    console.log('Server Response: Permission Required');

    // Set logon data for ApiResponse
    let apiResponse = ApiResponse.init(this.repository.cloneState());

    // Permission Required
    response.send(apiResponse.permissionRequired());
  }
  protected sendDataError(response: Response<ApiResponse<T>, Record<string, any>, number>, message:string) {

    console.log('Server Response: Input Data Error');

    // Set logon data for ApiResponse
    let apiResponse = ApiResponse.init(this.repository.cloneState());

    // Input Data Error
    response.send(apiResponse.inputDataError(message));
  }
  protected sendError(response: Response<ApiResponse<T>, Record<string, any>, number>, message:string) {

    console.log('Server Response: Server Error');

    // Set logon data for ApiResponse
    let apiResponse = ApiResponse.init(this.repository.cloneState());

    // Send success
    response.send(apiResponse.serverError(message));
  }
}
