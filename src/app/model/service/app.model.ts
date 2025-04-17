import {UserJWT} from './user-logon.model';
import {User} from '../repository/user.model';
import {PageData} from './page.model';
import {SearchModel} from './search.model';
import {RepositoryState} from '../repository/repository-state.model';
import {RepositoryEntity} from '../repository/repository-entity';

export enum ApiResponseType {
  None = 'None',
  Success = 'Success',
  LogonRequired = 'Logon Required',
  PermissionRequired = 'Permission Required',
  InputDataError = 'Input Data Error',
  ServerError = 'Server Error'
}

export class ApiData<T extends RepositoryEntity> {
  public data:T | undefined = undefined;
  public dataSet:Array<T> | undefined = [];
  public isDataSet:boolean = false;

  constructor(){}

  public static fromSingle<T extends RepositoryEntity>(entity: T): ApiData<T> {
    let result:ApiData<T> = new ApiData<T>();
    result.data = entity;
    result.isDataSet = false;
    return result;
  }

  public static fromSet<T extends RepositoryEntity>(entities: Array<T>): ApiData<T> {
    let result:ApiData<T> = new ApiData<T>();
    result.dataSet = entities;
    result.isDataSet = true;
    return result;
  }

  public static default<T extends RepositoryEntity>() {
    return new ApiData<T>();
  }
}

export class ApiRequest<T extends RepositoryEntity> {
  public pageData:PageData | undefined;
  public data: T | undefined;

  // Used only with repository-related client / server methods
  //
  public repositoryState:RepositoryState<T>;

  public constructor() {
    this.repositoryState = new RepositoryState(0, SearchModel.default());
  }

  public static simple() {
    return new ApiRequest();
  }

  public static postBody<T extends RepositoryEntity>(data:T) {
    let result = new ApiRequest();
    result.data = data;
    return result;
  }

  public static paged<T extends RepositoryEntity>(pageData:PageData, state:RepositoryState<T>) {
    let result: ApiRequest<T> = new ApiRequest<T>();
    result.pageData = pageData;
    result.repositoryState = state;
    return result;
  }

  public static full<T extends RepositoryEntity>(data:T, pageData:PageData, state:RepositoryState<T>) {
    let result: ApiRequest<T> = new ApiRequest<T>();
    result.data = data;
    result.pageData = pageData;
    result.repositoryState = state;
    return result;
  }

  public static default<T extends RepositoryEntity>() {
    return new ApiRequest<T>();
  }
}

export class ApiResponse<T extends RepositoryEntity>  {

  public apiData: ApiData<T>;
  public response: ApiResponseType;
  public message: string;
  public pageData: PageData | undefined;

  // Used only with repository-related client / server methods
  //
  public repositoryState:RepositoryState<T>;

  // JWT Session Data (property names)
  public userInfo: UserJWT;
  public loginNotRequired: boolean;

  constructor() {
    this.response = ApiResponseType.None;
    this.message = '';
    this.userInfo = UserJWT.default();
    this.apiData = ApiData.default<T>();
    this.loginNotRequired = true;
    this.repositoryState = new RepositoryState(0, SearchModel.default())
  }

  public static initLogonRequired<T extends RepositoryEntity>() : ApiResponse<T> {
    let result = new ApiResponse<T>();
    result.loginNotRequired = true;
    return result;
  }

  public static initLogonNotRequired<T extends RepositoryEntity>() : ApiResponse<T> {
    let result = new ApiResponse<T>();
    result.loginNotRequired = true;
    return result;
  }

  public setPageData(pageData:PageData | undefined)   {
    this.pageData = pageData;
    return this;
  }

  public loggedOn(user: UserJWT) : ApiResponse<T> {
    let result = new ApiResponse<T>();
    result.userInfo = user;
    return result;
  }

  public notLoggedOn() : ApiResponse<T> {
    let result = new ApiResponse<T>();
    result.userInfo = UserJWT.default();
    return result;
  }

  public setData(apiData:ApiData<T>)  {
    this.apiData = apiData;
    return this;
  }

  public success() {

    this.response = ApiResponseType.Success;
    this.message = '';

    return this;
  }

  public logonRequired() {

    this.response = ApiResponseType.LogonRequired;
    this.message = 'User logon is required';

    return this;
  }

  public permissionRequired() {
    this.response = ApiResponseType.PermissionRequired;
    this.message = 'Permission is required for access';

    return this;
  }

  public inputDataError(message:string) {
    this.response = ApiResponseType.InputDataError;
    this.message = message;

    return this;
  }

  public serverError(message:string) {
    this.response = ApiResponseType.ServerError;
    this.message = message;

    return this;
  }

  public logonMet() {
    return this.loginNotRequired || (!this.loginNotRequired && !!this.userInfo.token);
  }
}

export class Size {
  public width: number = 0;
  public height: number = 0;

  constructor() {
  }

  public static default() {
    return new Size();
  }

  public static from(width: number, height: number){
    let result = new Size();
    result.width = width;
    result.height = height;
    return result;
  }

  public static scaled(width: number, height: number, multiplier:number){
    let result = new Size();
    result.width = width * multiplier;
    result.height = height * multiplier;
    return result;
  }
}
