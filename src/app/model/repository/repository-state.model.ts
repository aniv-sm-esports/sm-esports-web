import {SearchModel} from './search.model';
import {RepositoryEntity} from './repository-entity';
import {RepositoryStateData} from './repository-state-data.model';
import { RepositoryStateDiffer } from './repository-state-differ.model';

export class RepositoryState<T extends RepositoryEntity> {

  // Filters are applied globally for this repository instance. Spawn child repositories for filtering
  // parent ones from the database.
  //
  protected entityName:string;
  protected repositoryKey:string;
  protected isPrimary: boolean;
  protected filter:SearchModel<T>;
  protected filteredRecordCapacity: number;
  protected unfilteredRecordCapacity: number;
  protected invalid:boolean;

  getKey() {return this.repositoryKey;}
  getEntityName() {return this.entityName;}
  getIsPrimary() {return this.isPrimary;}
  getInvalid() {return this.invalid;}
  getFilteredRecordCapacity(){return this.filteredRecordCapacity;}
  getUnFilteredRecordCapacity(){return this.unfilteredRecordCapacity;}
  getFilter(){return this.filter;}

  constructor(repositoryKey:string,
              entityName:string,
              isPrimary:boolean,
              filteredRecordCapacity: number,
              unfilteredRecordCapacity: number,
              filter:SearchModel<T>) {
    this.repositoryKey = repositoryKey;
    this.entityName = entityName;
    this.isPrimary = isPrimary;
    this.filteredRecordCapacity = filteredRecordCapacity;
    this.unfilteredRecordCapacity = unfilteredRecordCapacity;
    this.filter = filter;
    this.invalid = false;

    // Problem with initialization of subscription - initial firing invalidated
    // the state! So, this subscription will keep a weak (?) reference to the
    // input filter "filter" on this stack.
    this.filter.searchChange$.subscribe(searchChange => {
      //this.invalid = this.filter.differs(filter);
    });
  }

  public static from<T extends RepositoryEntity>(data:RepositoryStateData<T>) {
    return new RepositoryState<T>(
      data.repositoryKey,
      data.entityName,
      data.isPrimary,
      data.filteredRecordCapacity,
      data.unfilteredRecordCapacity,
      new SearchModel<T>(data.filterSearch, data.filterSearchSettings));
  }

  // Used by primary repository to update record count
  primaryAppend(recordsAdded:number, invalidate:boolean) {

    if (!this.isPrimary) {
      console.log(`Error: Trying to update non-primary repository:  ${this.repositoryKey}`);
      return;
    }

    // TODO!
    this.filteredRecordCapacity += recordsAdded;
    this.unfilteredRecordCapacity += recordsAdded;
    this.invalid = this.invalid || invalidate;
  }

  // Sets the state of (this) repository to the parent repository. This would be
  // done during a refresh of the repository, or during initialization.
  //
  set(parentState:RepositoryState<T>) {

    if (parentState.entityName !== this.entityName ||
        parentState.repositoryKey !== this.repositoryKey) {
      console.log(`Error:  Entity Name / Repository Keys don't match:  ParentKey(${parentState.repositoryKey}), ParentEntity(${parentState.entityName}), ChildKey(${this.repositoryKey}), ChildEntity(${this.entityName})`)
      return;
    }

    let changed =  RepositoryStateDiffer.filterDiff(this.filter, parentState.filter);

    this.entityName = parentState.entityName;
    this.repositoryKey = parentState.repositoryKey;

    // Don't want to erase observables
    this.filter.search = parentState.filter.search;
    this.filter.searchSettings = parentState.filter.searchSettings;

    // -> Notify()
    if (changed) {
      this.filter.searchChangeBehavior.next(this.filter);
    }

    // -> Must Initialize! The state has been modified. After initializing, there
    //                     should be a client-initiated get for record pages or entities.
    this.invalid = parentState.invalid;
    this.unfilteredRecordCapacity = parentState.unfilteredRecordCapacity;
    this.filteredRecordCapacity = parentState.filteredRecordCapacity;
  }
}
