import {UserJWT} from './user-logon.model';
import {User} from '../repository/entity/user.model';
import {PageData} from './page.model';
import {SearchModel} from '../repository/search.model';
import {RepositoryState} from '../repository/repository-state.model';
import {RepositoryEntity} from '../repository/repository-entity';
import {RepositoryStateData} from '../repository/repository-state-data.model';

export enum ApiResponseType {
  None = 'None',
  Success = 'Success',
  LogonRequired = 'Logon Required',
  PermissionRequired = 'Permission Required',
  InputDataError = 'Input Data Error',
  ServerError = 'Server Error'
}

export class ApiData<T extends RepositoryEntity> {
  public data:T[] = [];

  constructor(data:T[]) {
    this.data = data;
  }

  public static default<T extends RepositoryEntity>() {
    return new ApiData<T>([]);
  }
}

export class ApiRequest<T extends RepositoryEntity> {

  // Used only with repository-related client / server methods
  //
  public repositoryState:RepositoryStateData<T>;
  public requestData:ApiData<T>;
  public pageData:PageData;

  public constructor(stateData:RepositoryStateData<T>, pageData:PageData) {
    this.repositoryState = stateData;
    this.requestData = ApiData.default();
    this.pageData = pageData;
  }
}

export class ApiResponse<T extends RepositoryEntity>  {

  // Used only with repository-related client / server methods
  //
  public repositoryState:RepositoryStateData<T>;

  public responseData: ApiData<T>;
  public response: ApiResponseType;
  public message: string;

  // JWT Session Data (property names)
  public userInfo: UserJWT;
  public loginNotRequired: boolean;

  constructor(stateData:RepositoryStateData<T>) {
    this.response = ApiResponseType.None;
    this.message = '';
    this.userInfo = UserJWT.default();
    this.responseData = ApiData.default();
    this.loginNotRequired = true;
    this.repositoryState = stateData;
  }

  public static init<T extends RepositoryEntity>(stateData:RepositoryStateData<T>) : ApiResponse<T> {
    return new ApiResponse<T>(stateData);
  }

  public logonRequired(value:boolean):ApiResponse<T> {
    if (value) {
      this.response = ApiResponseType.LogonRequired;
      this.message = 'User logon is required';
    }
    else {
      this.loginNotRequired = !value;
    }
    return this;
  }

  public loggedOn(user: UserJWT) : ApiResponse<T> {
    this.userInfo = user;
    return this;
  }

  public notLoggedOn() : ApiResponse<T> {
    this.userInfo = UserJWT.default();
    return this;
  }

  public setData(apiData:ApiData<T>)  {
    this.responseData = apiData;
    return this;
  }

  public success() {

    this.response = ApiResponseType.Success;
    this.message = '';

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
