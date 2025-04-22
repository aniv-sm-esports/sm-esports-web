import { RepositoryEntity } from './repository-entity';
import { RepositoryState } from './repository-state.model';
import { Expose, Exclude, classToPlain } from 'class-transformer';

// Class for data transport for RepositoryState<T>
export class RepositoryStateData<T extends RepositoryEntity> {
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

  public static from<T extends RepositoryEntity>(state:RepositoryState<T>): RepositoryStateData<T> {
    let result = new RepositoryStateData<T>();
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
