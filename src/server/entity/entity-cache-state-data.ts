import { EntityCacheState } from './entity-cache-state';
import {Entity} from './model/Entity';

// Class for data transport for RepositoryState<T>
export class EntityCacheStateData<T extends Entity<T>> {
  public repositoryKey:string;
  public entityName:string;
  public isPrimary: boolean;
  public filterSearchSettings: string[];
  public filterSearch: T;
  public filteredRecordCapacity: number;
  public unfilteredRecordCapacity: number;
  public invalid:boolean;

  constructor() {
    this.repositoryKey = '';
    this.entityName = '';
    this.isPrimary = false;
    this.filterSearchSettings = [];
    this.filterSearch = {} as T;
    this.filteredRecordCapacity = 0;
    this.unfilteredRecordCapacity = 0;
    this.invalid = false;
  }

  public static from<T extends Entity<T>>(state:EntityCacheState<T>): EntityCacheStateData<T> {
    let result = new EntityCacheStateData<T>();
    result.entityName = state.getEntityName();
    result.repositoryKey = state.getKey();
    result.isPrimary = state.getIsPrimary();
    result.filterSearchSettings = Array.from(state.getFilter().searchSettings.keys());
    result.filterSearch = state.getFilter().search;
    result.filteredRecordCapacity = state.getFilteredRecordCapacity();
    result.unfilteredRecordCapacity = state.getFilteredRecordCapacity();
    result.invalid = state.getInvalid();
    return result;
  }
}
