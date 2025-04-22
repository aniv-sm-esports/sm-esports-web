import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../model/repository/entity/user.model';
import {ApiRequest, ApiResponse, ApiResponseType} from '../model/service/app.model';
import {SearchModel} from '../model/repository/search.model';
import {RepositoryEntity} from '../model/repository/repository-entity';
import {RepositoryClient} from '../model/repository/repository-client.model';
import {PageData, PageInfo} from '../model/service/page.model';
import {RepositoryPageAvailability} from '../model/repository/repository.model';
import {Predicate} from '../model/service/handler.model';
import {RepositoryState} from '../model/repository/repository-state.model';

@Injectable({
  providedIn: 'root'
})
export abstract class RepositoryService<T extends RepositoryEntity> {

  private readonly http: HttpClient;
  private readonly repository:RepositoryClient<T>;

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*',
  });

  private readonly defaultPageSize:number = 25;

  protected constructor(repositoryKey:string, repositoryName:string, httpClient: HttpClient, initialFilter:T, initialFilterFields:string[]) {

    this.http = httpClient;
    this.repository = new RepositoryClient<T>(repositoryKey, repositoryName, new SearchModel<T>(initialFilter, initialFilterFields), []);

    // Filter Change -> GET RepositoryState -> GET Page1, Page2, ..., Page N
    this.repository.onFilterChange().subscribe(change => {

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
    return this.repository.repositoryChange$;
  }

  // Event that occurs when the repository filter is modified. This will invalidate
  // the repository.
  //
  public onFilterChange() {
    return this.repository.onFilterChange();
  }

  public getRepositoryState() {
    return this.repository.cloneState();
  }

  public updateSearch(searchField: string, searchInput: any) {
    this.repository.setFilter(searchField, searchInput);
  }

  public resetSearch() {
    this.repository.clearFilter();
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

    return new Promise<ApiResponse<T>>((resolve, reject) => {

      // Client -> Server (Prioritize)
      if (this.repository.hasPendingFilterChange()) {
        this.http
          .post<ApiResponse<T>>(this.getRepositoryClientStateUrl(),
                                new ApiRequest<T>(this.repository.cloneState(), new PageData(1, this.defaultPageSize)), {headers: this.headers})
          .subscribe(response => {
            if (response.response == ApiResponseType.Success) {
              this.repository.update(response.repositoryState);
              resolve(response);
            }
            else {
              reject();
            }
          });
      }

      // Client Invalid
      else if (this.repository.getInvalid()) {
        this.http
          .get<ApiResponse<T>>(this.getRepositoryStateUrl(), {headers: this.headers})
          .subscribe(response => {
            if (response.response == ApiResponseType.Success) {
              this.repository.update(response.repositoryState);
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
          .post<ApiResponse<T>>(this.getRepositoryClientCheckUrl(),
                                new ApiRequest<T>(this.repository.cloneState(), new PageData(1, this.defaultPageSize)), {headers: this.headers})
          .subscribe(response => {
            if (response.response == ApiResponseType.Success) {
              this.repository.update(response.repositoryState);
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
  public getPageInfo(pageNumber:number, pageSize:number) {

    // Procedure:  Assumes filtered state
    //
    // 1) Synchronize State
    // 2) Get page data for the requested page; and correct page size.
    //
    return this.synchronizeState().then((response) =>{

      let total = response.repositoryState.unfilteredRecordCapacity;
      let totalFiltered = response.repositoryState.filteredRecordCapacity;
      let startIndex = (pageNumber - 1) * pageSize;
      let endIndex = pageNumber * pageSize;

      startIndex = Math.min(Math.max(startIndex, 0), totalFiltered - 1);
      endIndex = Math.max(Math.min(endIndex, totalFiltered - 1), 0);

      let page = Math.ceil((startIndex + 1) / pageSize);
      let size = endIndex - startIndex + 1;

      let result = new PageInfo(page, size);
      result.set(total, totalFiltered);

      return result;
    })

  }

  // GET: Returns the first result from the synced repository that corresponds to the
  //      current search.
  //
  public get(pageInfo:PageInfo) {

    // Procedure:  Assumes filtered state
    //
    // 1) Synchronize State
    // 2) Check Local Repository
    // 3) -> Contains Records: Get Local
    //    -> Does Not Contain Records: Get Remote
    //

    return new Promise<T[]>((resolve, reject) => {

      // Synchronize (Filtered!)
      this.synchronizeState().then((response) => {

        let page = new PageData(pageInfo.getPageNumber(), pageInfo.getPageSize());

        // Local Data (Resolve)
        if (this.repository
                .contains(page) == RepositoryPageAvailability.Full) {
          resolve(this.repository.getPage(page) || []);
        }

        // Remote Data
        else {
          this.getRemote(page).subscribe(response => {

            // Success
            if (response.response == ApiResponseType.Success) {

              // -> Update Client Repository (Checking State!)
              this.repository.updateData(response.repositoryState, response.responseData.data);

              // Resolve
              resolve(response.responseData.data);
            }

            // Failure
            else {
              reject(response.message);
            }
          });
        }

      });
    });
  }

  public getAll() {

    // Procedure:  Assumes filtered state
    //
    // 1) Synchronize State
    // 2) Check to see if capacity is met
    //    -> true:  resolve with records
    //    -> false: run full update (/api/.../getAll)
    //

    return new Promise<T[]>((resolve, reject) => {

      // Synchronize (Filtered!)
      this.synchronizeState().then((response) => {

        // Records already local (Needs checksum!)
        if (this.repository.getRecordCount() === response.repositoryState.unfilteredRecordCapacity) {
          resolve(this.repository.getAll());
        }

        // Remote
        else {

          this.getAllRemote().subscribe(response => {

            // Success
            if (response.response == ApiResponseType.Success) {

              // -> Update Client Repository (Checking State!)
              if (!this.repository.updateData(response.repositoryState, response.responseData.data)) {

                // Reject (Needs to re-try) (up to a limit.. maybe 3 tries?)
                reject(`Error: Client repository out of sync!  ${this.getRepositoryKey()}`);
              }
              else {

                // Resolve
                resolve(response.responseData.data);
              }
            }

            // Failure
            else {
              reject(response.message);
            }
          });
        }

      });
    });
  }

  // GET: Returns a number of records by a predicate. This will also honor the current
  //      client-side filter; but MUST QUERY-ALL FROM THE SERVER.
  //
  public getBy(predicate:Predicate<T>) {

    // Procedure:  Assumes filtered state
    //
    // 1) Synchronize State
    // 2) Query All!
    // 3) Apply User Predicate -> Return
    //

    return new Promise<T[]>((resolve, reject) => {

      this.getAll().then((response) => {
        resolve(this.repository.where(predicate) || []);
      });

    });
  }

  // Creates a new entity on the remote server repository
  public create(entity:T) {

    // Procedure:
    //
    // 1) Synchronize:   This will ensure that the final response will have
    //                   the latest, fresh, page. (Also Server Required!)
    // 2) Create POST:   Send new entity (server supplies next ID)
    // 3) Update Client: The return state will be up to date!
    //

    return new Promise<T>((resolve, reject) => {

      // Synchronize
      this.synchronizeState().then((response) => {

        // Create
        this.createRemote(entity).subscribe(response => {

          // Resolve
          if (response && response.response == ApiResponseType.Success && response.responseData.data) {
            this.repository.update(response.repositoryState);
            this.repository.updateData(response.repositoryState, response.responseData.data);

            // TODO: Response needs an enumeration to specify data type
            resolve(response.responseData.data[0]);
          }
          // Reject
          else {
            console.log(response.message);
            reject(undefined);
          }
        });
      });
    });
  }

  private createRemote(entity:T) {
    return this.http.post<ApiResponse<T>>(this.createUrl(), entity);
  }

  private getRemote(pageData:PageData) {
    return this.http
               .post<ApiResponse<T>>(this.getUrl(), new ApiRequest<T>(this.repository.cloneState(), pageData), {headers: this.headers});
  }

  private getAllRemote() {
    return this.http
               .post<ApiResponse<T>>(this.getAllUrl(), new ApiRequest<T>(this.repository.cloneState(), PageData.default()), {headers: this.headers});
  }
}
