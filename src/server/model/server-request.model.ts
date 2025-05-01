import {Entity} from '../entity/model/Entity';
import {EntityCacheStateData} from '../entity/entity-cache-state-data';
import {PageData} from './page-data.model';
import { ServerData } from './server-entity-data';

export class ServerRequest<T> {

  public requestData:ServerData<T>;
  public pageData:PageData;

  public constructor(requestData:ServerData<T>, pageData:PageData) {
    this.requestData = requestData;
    this.pageData = pageData;
  }
}

export class ServerEntityRequest<T extends Entity<T>> extends ServerRequest<T> {

  // Used only with entity cache-related client / server methods
  //
  public cacheState:EntityCacheStateData<T>;

  constructor(cacheState:EntityCacheStateData<T>, requestData:ServerData<T>, pageData:PageData) {
    super(requestData, pageData);

    this.cacheState = cacheState;
  }
}
