import {RepositoryState} from './repository-state.model';
import {RepositoryEntity} from './repository-entity';
import {PageData} from '../service/page.model';
import {SearchModel, SearchModelFilter} from './search.model';
import {Callback, Predicate} from '../service/handler.model';
import lodash from 'lodash';
import {RepositoryStateData} from './repository-state-data.model';

export enum RepositoryPageAvailability {
  Invalid = 0,
  None = 1,
  Partial = 2,
  Full = 3
}

export class Repository<T extends RepositoryEntity> {

  protected readonly entities:Array<T> = new Array<T>();
  protected readonly entityMap:Map<number, T> = new Map();

  protected state:RepositoryState<T>;

  constructor(repositoryKey:string, entityName:string, search:SearchModel<T>, entities:Array<T>, isPrimary:boolean) {

    // Load the repository with all filters applied
    this.entities.forEach(entity => {
      if (SearchModelFilter.apply(entity, search)) {
        this.entities.push(entity);
        this.entityMap.set(entity.id, entity);
      }
    });

    // Initialize State
    this.state = new RepositoryState<T>(repositoryKey, entityName, isPrimary, this.entities.length, entities.length, search);
  }

  // Returns a clone of the current state of the repository
  cloneState() {
    return RepositoryStateData.from<T>(this.state);
  }

  getRecordCount() {
    return this.entities.length;
  }

  // Returns true if this repository is out of date
  getInvalid() {
    return this.state.getInvalid();
  }

  get(id:number) {

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    return this.entityMap.get(id);
  }

  getAll() {
    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return [];
    }

    return this.entities;
  }

  has(id:number) {

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    return this.entityMap.has(id);
  }

  forEach(callback:Callback<T>){
    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    return this.entities.forEach(callback);
  }

  any(callback:Predicate<T>) {

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    return this.entities.some((item:T) => callback(item));
  }

  first(callback:Predicate<T>) {

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    let filtered = this.entities.filter((item:T) => callback(item));

    if (filtered && filtered.length > 0) {
      return filtered[0];
    }
    else
      return undefined;
  }

  where(callback:Predicate<T>) {

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    return this.entities.filter((item:T) => callback(item)) || [];
  }

  // Returns the availability of the repository for the requested page (given its last update)
  contains(pageData:PageData) {

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    let startIndex = (pageData.pageNumber - 1) * pageData.pageSize;
    let endIndex = pageData.pageNumber * pageData.pageSize;

    if (endIndex <= startIndex ||
      endIndex < 0 ||
      startIndex < 0) {
      return RepositoryPageAvailability.Invalid;
    }

    if (this.entities.length - 1 < startIndex)
      return RepositoryPageAvailability.None;

    else if (this.entities.length - 1 < endIndex) {
      return RepositoryPageAvailability.Partial;
    }
    else
      return RepositoryPageAvailability.Full;
  }

  // Returns a page of entities corresponding to the requested page; and validates against
  // the RepositoryState (missing id's + other state information)
  //
  getPage(pageData:PageData) {

    let result:Array<T> = [];

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    if (this.contains(pageData) === RepositoryPageAvailability.None ||
      this.contains(pageData) === RepositoryPageAvailability.Invalid) {
      console.log(`Error: Page data is not available in repository. Please query the server for update:  ${this.state.getKey()}`);
      return;
    }

    let startIndex = (pageData.pageNumber - 1) * pageData.pageSize;
    let endIndex = pageData.pageNumber * pageData.pageSize;

    // Fulfill Request (may be partial)
    //
    for (let index= startIndex; (index < endIndex) && (index < this.entities.length); index++) {
        result.push(this.entities[index]);
    }

    return result;
  }
}
