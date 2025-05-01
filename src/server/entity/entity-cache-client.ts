import {BehaviorSubject} from 'rxjs';
import lodash from 'lodash';
import {EntityCache, EntityCachePageAvailability} from './entity-cache';
import {Entity} from './model/Entity';
import { EntityCacheSearch } from './entity-cache-search';
import {ServerData} from '../model/server-entity-data';
import { EntityCacheState } from './entity-cache-state';
import {EntityCacheStateData} from './entity-cache-state-data';
import {EntityCacheStateDiffer} from './entity-cache-state-differ';
import {PageData} from '../model/page-data.model';
import { Predicate } from '../../app/model/service/handler.model';

// Design:  The client repository listens for state updates. Once an update is received, the
//          state is stored as "current (filter-state)". Then, pages are drawn from the server's
//          "child repository" - which will be cached for a (session) amount of time, or until
//          the client forces new filter settings.
//
export class EntityCacheClient<T extends Entity<T>> extends EntityCache<T> {

  // Pending Filter:  This is treated like an "output filter" to the server. Once changes
  //                  are applied, all other functions will wait for an update.
  //
  protected pendingFilter:EntityCacheSearch<T>;
  protected hasPendingFilter:boolean = false;

  // Repository Changes
  //
  protected repositoryChangeBehavior = new BehaviorSubject<ServerData<T>>(new ServerData([]));
  protected repositoryChangeAllBehavior = new BehaviorSubject<ServerData<T>>(new ServerData([]));

  public repositoryChange$ = this.repositoryChangeBehavior.asObservable();
  public repositoryChangeAll$ = this.repositoryChangeAllBehavior.asObservable();

  constructor(repositoryKey:string, entityName:string, search:EntityCacheSearch<T>) {
    super(repositoryKey, entityName, search, false);

    this.pendingFilter = lodash.cloneDeep(search);
    this.hasPendingFilter = false;
  }

  setFilter(searchField: string, searchInput: any) {
    this.pendingFilter.set(searchField, searchInput);
    this.hasPendingFilter = true;
  }

  clearFilter(){
    this.pendingFilter.clear();
    this.hasPendingFilter = true;
  }

  hasPendingFilterChange() {
    return this.hasPendingFilter;
  }

  onFilterChange() {
    return this.state.getFilter().searchChange$
  }

  getRecordCount() {
    return super.getCache().length;
  }

  // Updates Repository state from the server. Verify that the state filter matches the
  // client pending state.
  update(stateData:EntityCacheStateData<T>) {

    let state = EntityCacheState.from<T>(stateData);

    // Diff State
    if (EntityCacheStateDiffer.filterDiff(this.pendingFilter, state.getFilter())) {
      console.log(`Error:  Server-side filter differs from local one. Deferring to server-side filter:  ${this.state.getKey()}`);
    }

    // Update State
    this.state.set(state);

    // Reset Pending Filter
    this.pendingFilter = this.state.getFilter();
    this.hasPendingFilter = false;
  }

  // Updates Repository from page data from another repository (usually server -> client)
  updateData(serverState:EntityCacheStateData<T>, entities:Array<T>):boolean {

    let state = EntityCacheState.from<T>(serverState);

    // First, call update
    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return false;
    }

    // Make sure repository states match!
    if (EntityCacheStateDiffer.stateDiff(state, this.state)) {
      console.log(`Error: Trying to update data before updating state (${this.state.getKey()})`);
      return false;
    }

    // Make sure there are no pending filters!
    if (this.hasPendingFilter) {
      console.log(`Error: Trying to update data before using pending filter (${this.state.getKey()})`);
      return false;
    }

    let recordsAdded = 0;

    // Map the result
    for (let index = 0; index < entities.length; index++) {

      // Match by the required :id
      let existing = this.getCache().find(item => item.id === entities[index].id);

      if (!existing) {
        this.cacheAppend(entities[index])
        recordsAdded++;
      }
      else {
        Object.assign(existing, entities[index]); // References both entity collections!
      }
    }

    console.log(`Cache records added:  ${recordsAdded}`);

    // NOTIFY
    this.notify(entities);

    return true;
  }

  // Returns a page of entities corresponding to the requested page; and validates against
  // the RepositoryState (missing id's + other state information)
  //
  public getPage(pageData:PageData) {

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    let offset = ((pageData.pageNumber - 1) * pageData.pageSize);

    return this.getCache().slice(offset, offset + pageData.pageSize);
  }

  // Returns all records from a (VALID) cache only.
  public getAll() {
    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    return this.getCache();
  }

  public whereBy(predicate:Predicate<T>) {
    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    return this.getCache().filter(predicate);
  }

  // Returns the availability of the repository for the requested page (given its last update)
  public override containsPage(pageData:PageData) {

    if (this.state.getInvalid()) {
      throw new Error(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
    }

    let startIndex = (pageData.pageNumber - 1) * pageData.pageSize;
    let endIndex = pageData.pageNumber * pageData.pageSize;

    if (endIndex <= startIndex ||
      endIndex < 0 ||
      startIndex < 0) {
      return EntityCachePageAvailability.Invalid;
    }

    if (this.getCache().length - 1 < startIndex)
      return EntityCachePageAvailability.None;

    else if (this.getCache().length - 1 < endIndex) {
      return EntityCachePageAvailability.Partial;
    }
    else
      return EntityCachePageAvailability.Full;
  }

  private notify(data:T[]) {

    // First, call update
    if (this.state.getInvalid()) {
      throw new Error(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
    }
    else {
      this.repositoryChangeBehavior.next(new ServerData(data));
      this.repositoryChangeAllBehavior.next(new ServerData(this.getCache()));
    }
  }
}
