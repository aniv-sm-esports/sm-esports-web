import { IRepositoryEntity } from "./model/IRepositoryEntity";
import {Callback, Predicate} from '../../app/model/service/handler.model';
import {PageData} from '../../app/model/service/page.model';
import {RepositoryPageAvailability} from '../../app/model/repository/repository.model';
import {EntityCacheSearch, ServerSearchModelFilter} from './entity-cache-search';
import {EntityCacheState} from './entity-cache-state';
import {EntityCacheStateData} from './entity-cache-state-data';

export class EntityCache<T extends IRepositoryEntity<T>> {

  protected readonly entities:Array<T> = new Array<T>();
  protected readonly entityMap:Map<number, T> = new Map();

  protected lastModified: Date | undefined;

  protected state:EntityCacheState<T>;

  constructor(repositoryKey:string, entityName:string, search:EntityCacheSearch<T>, entities:Array<T>, isPrimary:boolean) {

    // Load the repository with all filters applied
    this.entities.forEach(entity => {
      if (ServerSearchModelFilter.apply(entity, search)) {
        this.entities.push(entity);
        this.entityMap.set(entity.Id, entity);
      }
    });

    // Initialize State
    this.state = new EntityCacheState<T>(repositoryKey, entityName, isPrimary, this.entities.length, entities.length, search);
  }

  // Returns a clone of the current state of the repository
  cloneState() {
    return EntityCacheStateData.from<T>(this.state);
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
