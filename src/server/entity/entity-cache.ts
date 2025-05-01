import {EntityCacheSearch, ServerSearchModelFilter} from './entity-cache-search';
import {EntityCacheState} from './entity-cache-state';
import {EntityCacheStateData} from './entity-cache-state-data';
import { Entity } from './model/Entity';
import {PageData} from '../model/page-data.model';

export enum EntityCachePageAvailability {
  Invalid = 0,
  None = 1,
  Partial = 2,
  Full = 3
}

// Design:  This component will serve as a base for either client / server entity transparent caching.
//          Use the protected methods to handle the private cache.
//
export abstract class EntityCache<T extends Entity<T>> {

  protected state:EntityCacheState<T>;
  private readonly entities:T[];
  private readonly entityMap:Map<number, T>;

  protected constructor(repositoryKey:string, entityName:string, search:EntityCacheSearch<T>, isPrimary:boolean) {
    this.entities = [];
    this.entityMap = new Map<number, T>();

    // Initialize State
    this.state = new EntityCacheState<T>(repositoryKey, entityName, isPrimary, 0, 0, search);
  }

  // Returns an enum to indicate whether a full, partial, or (empty) page is
  // currently available in a (valid) cache state. Returning Invalid implies
  // that the page data request was not properly formed.
  public abstract containsPage(pageData:PageData):EntityCachePageAvailability;

  // Returns a clone of the current state of the repository
  public cloneState() {
    return EntityCacheStateData.from<T>(this.state);
  }

  public getInvalid() {
    return this.state.getInvalid();
  }

  protected getCache() {
    if (this.state.getInvalid()) {
      throw new Error(`Error:  Trying to use EntityCache in an invalid state ${this.state.getEntityName()}`);
    }

    return this.entities;
  }

  protected getCacheMap() {
    if (this.state.getInvalid()) {
      throw new Error(`Error:  Trying to use EntityCache in an invalid state ${this.state.getEntityName()}`);
    }

    return this.entityMap;
  }

  protected cacheAppend(entity:T) {
    if (this.state.getInvalid()) {
      throw new Error(`Error:  Trying to use EntityCache in an invalid state ${this.state.getEntityName()}`);
    }

    if (this.entityMap.has(entity.Id)) {
      throw new Error(`Error:  Trying to append duplicate entity ${this.state.getEntityName()}`);
    }

    this.entities.push(entity);
    this.entityMap.set(entity.Id, entity);
  }
  protected cacheEvict(entity:T) {
    if (this.state.getInvalid()) {
      throw new Error(`Error:  Trying to use EntityCache in an invalid state ${this.state.getEntityName()}`);
    }

    if (!this.entityMap.has(entity.Id)) {
      throw new Error(`Error:  Trying to evice non-existent entity ${this.state.getEntityName()}`);
    }

    this.entities.filter(entity => entity.Id !== entity.Id);
    this.entityMap.delete(entity.Id);
  }
  protected cacheClear() {
    if (this.state.getInvalid()) {
      throw new Error(`Error:  Trying to use EntityCache in an invalid state ${this.state.getEntityName()}`);
    }

    this.entities.length = 0;
    this.entityMap.clear();
  }
}
