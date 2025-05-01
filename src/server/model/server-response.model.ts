import {Entity} from '../entity/model/Entity';
import {EntityCacheStateData} from '../entity/entity-cache-state-data';
import {ServerData} from './server-entity-data';

export enum ServerResponseType {
  None = 'None',
  Success = 'Success',
  LogonRequired = 'Logon Required',
  PermissionRequired = 'Permission Required',
  InputDataError = 'Input Data Error',
  ServerError = 'Server Error'
}

export enum ServerCacheDiffResult {
  Synchronized = 'Synchronized',
  ClientInvalid = 'Client Invalid'
}

export class ServerResponse<T>  {

  public responseData: ServerData<T>;
  public response: ServerResponseType;
  public message: string;

  constructor(responseData: ServerData<T>, response: ServerResponseType, message: string) {
    this.responseData = responseData;
    this.response = response;
    this.message = message;
  }

  public static fromData<T>(data:T) {
    return new ServerResponse(new ServerData([data]), ServerResponseType.Success, "");
  }
  public static fromError<T>(message:string) {
    return new ServerResponse<T>(ServerData.default(), ServerResponseType.ServerError, message);
  }
  public static fromDataError<T>(message:string) {
    return new ServerResponse<T>(ServerData.default(), ServerResponseType.InputDataError, message);
  }

}

export class ServerEntityResponse<T extends Entity<T>> extends ServerResponse<T> {

  // Used only with entity cache-related client / server methods
  //
  public cacheState:EntityCacheStateData<T>;
  public diffResult:ServerCacheDiffResult;

  constructor(cacheState:EntityCacheStateData<T>,
              diffResult:ServerCacheDiffResult,
              responseData:ServerData<T>,
              response: ServerResponseType,
              message: string) {
    super(responseData, response, message);
    this.cacheState = cacheState;
    this.diffResult = diffResult;
  }
}
