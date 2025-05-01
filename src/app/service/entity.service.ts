import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Predicate} from '../model/service/handler.model';
import {Entity} from '../../server/entity/model/Entity';
import {EntityCacheSearch} from '../../server/entity/entity-cache-search';
import {EntityCacheClient} from '../../server/entity/entity-cache-client';
import {ServerEntityResponse, ServerResponseType} from '../../server/model/server-response.model';
import {ServerEntityRequest} from '../../server/model/server-request.model';
import {PageData} from '../../server/model/page-data.model';
import {ServerData} from '../../server/model/server-entity-data';
import {EntityCachePageAvailability} from '../../server/entity/entity-cache';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class EntityService<T extends Entity<T>> {

  private readonly http: HttpClient;
  private readonly cacheClient:EntityCacheClient<T>;

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*',
  });

  private readonly defaultPageSize:number = 25;

  protected constructor(repositoryKey:string, repositoryName:string, httpClient: HttpClient, initialFilter:T, initialFilterFields:string[]) {

    this.http = httpClient;
    this.cacheClient = new EntityCacheClient<T>(repositoryKey, repositoryName, new EntityCacheSearch<T>(initialFilter, initialFilterFields));

    // Filter Change -> GET RepositoryState -> GET Page1, Page2, ..., Page N
    this.cacheClient.onFilterChange().subscribe(() => {

    });
  }

  // Repository API
  protected abstract getRepositoryStateUrl():string;
  protected abstract getRepositoryClientStateUrl():string;
  protected abstract getRepositoryClientCheckUrl():string;

  // This Service Name
  protected abstract getRepositoryKey():string;             // Needs a GET service endpoint
  protected abstract getEntityName():string;

  // Data API
  protected abstract getUrl():string;
  protected abstract getAllUrl():string;
  protected abstract createUrl():string;

  // Event that occurs when actual repository entities are updated. When the filter
  // is changed, there is a refresh to the server that will update the entity cache.
  //
  public onEntitiesChanged() {
    return this.cacheClient.repositoryChange$;
  }
  public onAllEntitiesChanged() {
    return this.cacheClient.repositoryChangeAll$;
  }

  // Event that occurs when the repository filter is modified. This will invalidate
  // the repository.
  //
  public onFilterChange() {
    return this.cacheClient.onFilterChange();
  }

  public getRepositoryState() {
    return this.cacheClient.cloneState();
  }

  public updateSearch(searchField: string, searchInput: any) {
    this.cacheClient.setFilter(searchField, searchInput);
  }

  public resetSearch() {
    this.cacheClient.clearFilter();
  }

  private synchronizeState() {

    // Procedure
    // 1) If Pending Client Change:  Push -> Server
    // 2) If Client Invalid:  Pull <- Server
    // 3) Else Check Server:  Pull <- Server
    //
    // Next:  Use ApiResponse<T> as the first page of data for each
    //        of these calls. So, the server will send a small set
    //        of records back with this call. Proceed from there!
    //
    // Valid Client:  If the client was already valid, then the response
    //                will still be the first page.
    //

    return new Promise<ServerEntityResponse<T>>((resolve, reject) => {

      // Client -> Server (Prioritize)
      if (this.cacheClient.hasPendingFilterChange()) {
        this.http
          .post<ServerEntityResponse<T>>(this.getRepositoryClientStateUrl(),
                                new ServerEntityRequest<T>(this.cacheClient.cloneState(), ServerData.default(), new PageData(1, this.defaultPageSize)), {headers: this.headers})
          .subscribe(response => {
            if (response.response == ServerResponseType.Success) {
              this.cacheClient.update(response.cacheState);
              resolve(response);
            }
            else {
              reject();
            }
          });
      }

      // Client Invalid
      else if (this.cacheClient.getInvalid()) {
        this.http
          .post<ServerEntityResponse<T>>(this.getRepositoryStateUrl(), {headers: this.headers})
          .subscribe(response => {
            if (response.response == ServerResponseType.Success) {
              this.cacheClient.update(response.cacheState);
              resolve(response);
            }
            else {
              reject();
            }
          });
      }

      // Valid Check!
      else {
        this.http
          .post<ServerEntityResponse<T>>(this.getRepositoryClientCheckUrl(),
                                new ServerEntityRequest<T>(this.cacheClient.cloneState(), ServerData.default(), new PageData(1, this.defaultPageSize)), {headers: this.headers})
          .subscribe(response => {
            if (response.response == ServerResponseType.Success) {
              this.cacheClient.update(response.cacheState);
              resolve(response);
            }
            else {
              reject();
            }
          });
      }
    });
  }

  // Returns the (corrected) page info for this repository after synchronizing
  // the client repository.
  public async getPageInfo(pageNumber:number, pageSize:number) {

    // Procedure:  Assumes filtered state
    //
    // 1) Synchronize State
    // 2) Get page data for the requested page; and correct page size.
    //
    return await this.synchronizeState().then((response) =>{

      let total = response.cacheState.unfilteredRecordCapacity;
      let totalFiltered = response.cacheState.filteredRecordCapacity;
      let startIndex = (pageNumber - 1) * pageSize;
      let endIndex = pageNumber * pageSize;

      startIndex = Math.min(Math.max(startIndex, 0), totalFiltered - 1);
      endIndex = Math.max(Math.min(endIndex, totalFiltered - 1), 0);

      let page = Math.ceil((startIndex + 1) / pageSize);
      let size = endIndex - startIndex + 1;

      return new PageData(page, size);
    });
  }

  // GET: Returns the first result from the synced repository that corresponds to the
  //      current search.
  //
  public async get(pageData:PageData) {

    // Procedure:  Assumes filtered state
    //
    // 1) Synchronize State
    // 2) Check Local Repository
    // 3) -> Contains Records: Get Local
    //    -> Does Not Contain Records: Get Remote
    //

    let result:T[] = [];

    // Synchronize (Filtered!)
    await this.synchronizeState().then(async (response) => {

      // Local Data (Resolve)
      if (this.cacheClient
              .containsPage(pageData) == EntityCachePageAvailability.Full) {

        result = this.cacheClient.getPage(pageData);
      }

      // Remote Data
      else {

        await firstValueFrom(this.getRemote(pageData)).then(getResponse => {
          // Success
          if (getResponse.response == ServerResponseType.Success) {

            // -> Update Client Repository (Checking State!)
            this.cacheClient.updateData(getResponse.cacheState, getResponse.responseData.data);

            // Resolve
            result = getResponse.responseData.data;
          }

          // Failure
          else {
            result = [];
          }
        });
      }
    });

    return result;
  }

  public async getAll() {

    // Procedure:  Assumes filtered state
    //
    // 1) Synchronize State
    // 2) Check to see if capacity is met
    //    -> true:  resolve with records
    //    -> false: run full update (/api/.../getAll)
    //

    let result: T[] = [];

    // Synchronize (Filtered!)
    await this.synchronizeState().then(async (response) => {

      // Records already local (Needs checksum!)
      if (this.cacheClient.getRecordCount() === response.cacheState.unfilteredRecordCapacity) {
        result = this.cacheClient.getAll();
      }

      // Remote
      else {

        await firstValueFrom(this.getAllRemote()).then(getResponse => {

          // Success
          if (getResponse.response == ServerResponseType.Success) {

            // -> Update Client Repository (Checking State!)
            if (!this.cacheClient.updateData(getResponse.cacheState, getResponse.responseData.data)) {

              // Reject (Needs to re-try) (up to a limit.. maybe 3 tries?)
              throw new Error(`Error: Client repository out of sync!  ${this.getRepositoryKey()}`);
            }
            else {
              result = getResponse.responseData.data;
            }
          }
        });
      }
    });

    return result;
  }

  // GET: Returns a number of records by a predicate. This will also honor the current
  //      client-side filter; but MUST QUERY-ALL FROM THE SERVER.
  //
  public async getBy(predicate:Predicate<T>) {

    // Procedure:  Assumes filtered state
    //
    // 1) Synchronize State
    // 2) Query All!
    // 3) Apply User Predicate -> Return
    //

    return await this.getAll().then((response) => {
      return this.cacheClient.whereBy(predicate);
    });
  }

  // Creates a new entity on the remote server repository
  public async create(entity:T) {

    // Procedure:
    //
    // 1) Synchronize:   This will ensure that the final response will have
    //                   the latest, fresh, page. (Also Server Required!)
    // 2) Create POST:   Send new entity (server supplies next ID)
    // 3) Update Client: The return state will be up to date!
    //

    let result:T = entity;

    // Synchronize
    await this.synchronizeState().then(async (response) => {

      // Create
      await firstValueFrom(this.createRemote(entity)).then(createResponse => {

        // Resolve
        if (createResponse && createResponse.response == ServerResponseType.Success && createResponse.responseData.data) {
          this.cacheClient.update(createResponse.cacheState);
          this.cacheClient.updateData(createResponse.cacheState, createResponse.responseData.data);

          // TODO: Response needs an enumeration to specify data type (don't use array)
          entity = createResponse.responseData.data[0];
        }
        // Reject
        else {
          throw new Error(createResponse.message);
        }
      });
    });

    return result;
  }

  private createRemote(entity:T) {
    return this.http.post<ServerEntityResponse<T>>(this.createUrl(), new ServerEntityRequest<T>(this.cacheClient.cloneState(), new ServerData([entity]), PageData.default()), {headers: this.headers});
  }

  private getRemote(pageData:PageData) {
    return this.http.post<ServerEntityResponse<T>>(this.getUrl(), new ServerEntityRequest<T>(this.cacheClient.cloneState(), new ServerData([]), pageData), {headers: this.headers});
  }

  private getAllRemote() {
    return this.http.post<ServerEntityResponse<T>>(this.getAllUrl(), new ServerEntityRequest<T>(this.cacheClient.cloneState(), new ServerData([]), PageData.default()), {headers: this.headers});
  }
}
