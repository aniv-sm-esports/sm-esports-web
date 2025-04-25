import {RepositoryState} from './repository-state.model';
import {RepositoryEntity} from './repository-entity';
import {SearchModel, SearchModelFilter} from './search.model';
import {BehaviorSubject} from 'rxjs';
import { ApiData } from '../service/app.model';
import lodash from 'lodash';
import {Repository} from './repository.model';
import { RepositoryStateData } from './repository-state-data.model';
import {RepositoryStateDiffer} from './repository-state-differ.model';

export enum RepositoryPageAvailability {
  Invalid = 0,
  None = 1,
  Partial = 2,
  Full = 3
}

// Design:  The client repository listens for state updates. Once an update is received, the
//          state is stored as "current (filter-state)". Then, pages are drawn from the server's
//          "child repository" - which will be cached for a (session) amount of time, or until
//          the client forces new filter settings.
//
export class RepositoryClient<T extends RepositoryEntity> extends Repository<T> {

  // Pending Filter:  This is treated like an "output filter" to the server. Once changes
  //                  are applied, all other functions will wait for an update.
  //
  protected pendingFilter:SearchModel<T>;
  protected hasPendingFilter:boolean = false;

  // Repository Changes
  //
  protected repositoryChangeBehavior = new BehaviorSubject<ApiData<T>>(ApiData.default());
  protected repositoryChangeAllBehavior = new BehaviorSubject<ApiData<T>>(ApiData.default());

  public repositoryChange$ = this.repositoryChangeBehavior.asObservable();
  public repositoryChangeAll$ = this.repositoryChangeAllBehavior.asObservable();

  constructor(repositoryKey:string, entityName:string, search:SearchModel<T>, entities:Array<T>) {
    super(repositoryKey, entityName, search, entities, false);

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

  // Updates Repository state from the server. Verify that the state filter matches the
  // client pending state.
  update(stateData:RepositoryStateData<T>) {

    let state = RepositoryState.from<T>(stateData);

    // Diff State
    if (RepositoryStateDiffer.filterDiff(this.pendingFilter, state.getFilter())) {
      console.log(`Error:  Server-side filter differs from local one. Deferring to server-side filter:  ${this.state.getKey()}`);
    }

    // Update State
    this.state.set(state);

    // Reset Pending Filter
    this.pendingFilter = this.state.getFilter();
    this.hasPendingFilter = false;
  }

  // Updates Repository from page data from another repository (usually server -> client)
  updateData(serverState:RepositoryStateData<T>, entities:Array<T>):boolean {

    let state = RepositoryState.from<T>(serverState);

    // First, call update
    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return false;
    }

    // Make sure repository states match!
    if (RepositoryStateDiffer.stateDiff(state, this.state)) {
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
      let existing = this.entities.find(item => item.id === entities[index].id);

      if (!existing) {
        this.entities.push(entities[index]);
        this.entityMap.set(entities[index].id, entities[index]);
        recordsAdded++;
      }
      else {
        Object.assign(existing, entities[index]); // References both entity collections!
      }
    }

    console.log(`Repository records added:  ${recordsAdded}`);

    // NOTIFY
    this.notify(entities);

    return true;
  }

  private notify(data:T[]) {
    let apiData = new ApiData(this.entities);

    this.repositoryChangeBehavior.next(apiData);
    this.repositoryChangeAllBehavior.next(new ApiData(this.entities));
  }
}
