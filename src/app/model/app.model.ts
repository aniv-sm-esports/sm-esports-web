import {UserJWT} from './user-logon.model';
import {User} from './user.model';
import {PageData} from './page.model';
import {SearchModel} from './search.model';

export enum ApiResponseType {
  None = 'None',
  Success = 'Success',
  LogonRequired = 'Logon Required',
  PermissionRequired = 'Permission Required',
  InputDataError = 'Input Data Error',
  ServerError = 'Server Error'
}

export class ApiRequest<T> {
  public pageData:PageData | undefined;
  public data: T | undefined;
  public search: SearchModel<T> | undefined;

  public constructor() {
  }

  public static simple<T>() {
    return new ApiRequest<T>();
  }

  public static postBody<T>(data:T) {
    let result: ApiRequest<T> = new ApiRequest<T>();
    result.data = data;
    return result;
  }

  public static paged<T>(pageData:PageData, search:SearchModel<T>) {
    let result: ApiRequest<T> = new ApiRequest<T>();
    result.pageData = pageData;
    result.search = search;
    return result;
  }

  public static full<T>(data:T, pageData:PageData, search:SearchModel<T>) {
    let result: ApiRequest<T> = new ApiRequest<T>();
    result.data = data;
    result.pageData = pageData;
    result.search = search;
    return result;
  }

  public static default<T>() {
    return new ApiRequest<T>();
  }
}

export class ApiResponse<T>  {

  public data: T | undefined;
  public response: ApiResponseType;
  public message: string;
  public pageData: PageData | undefined;

  // JWT Session Data (property names)
  public userInfo: UserJWT;
  public loginNotRequired: boolean;

  constructor() {
    this.response = ApiResponseType.None;
    this.message = '';
    this.userInfo = UserJWT.default();
    this.loginNotRequired = true;
  }

  public static initLogonRequired<T>() : ApiResponse<T> {
    let result = new ApiResponse<T>();
    result.loginNotRequired = true;
    return result;
  }

  public static initLogonNotRequired<T>() : ApiResponse<T> {
    let result = new ApiResponse<T>();
    result.loginNotRequired = true;
    return result;
  }

  public setPageData<T>(pageData:PageData | undefined)   {
    this.pageData = pageData;
    return this;
  }

  public loggedOn<T>(user: UserJWT) : ApiResponse<T> {
    let result = new ApiResponse<T>();
    result.userInfo = user;
    return result;
  }

  public notLoggedOn<T>() : ApiResponse<T> {
    let result = new ApiResponse<T>();
    result.userInfo = UserJWT.default();
    return result;
  }

  public success(data: T) {

    this.data = data;
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

  public inputDataError(data:T | undefined, message:string) {
    this.response = ApiResponseType.InputDataError;
    this.message = message;
    this.data = data;

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
