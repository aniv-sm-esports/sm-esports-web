import {RepositoryEntity} from './repository-entity';
import lodash from 'lodash';
import {BehaviorSubject} from 'rxjs';

export interface SearchSetting {
  [key:string]:boolean;
}

export interface MapType {
  [key:string]:any;
}

export class SearchModel<T extends RepositoryEntity> {

  public searchSettings: Map<string, boolean>;
  public search: T;

  // Search Filter Changes
  //
  public searchChangeBehavior = new BehaviorSubject<SearchModel<T>>(this);
  public searchChange$ = this.searchChangeBehavior.asObservable();

  constructor(search: T, searchFields: string[]) {
    this.search = search;
    this.searchSettings = new Map();

    searchFields.forEach(field => {
      this.searchSettings.set(field, true);
    });
  }

  public get(key: string) {

    if (!this.searchSettings.get(key)) {
      console.log("Trying to get search filter for unset field");
      return;
    }

    return lodash.get(this.search, key);
  }

  public set(key: string, value: any) {
    lodash.set(this.search, key, value);
    this.searchSettings.set(key, true);

    // Notify Observers
    this.searchChangeBehavior.next(this);
  }

  public has(key: string): boolean {
    return !!this.searchSettings.get(key);
  }

  // Return true if the filter is trivial (no fields will be filtered)
  public identity():boolean {
    return this.searchSettings.size == 0;
  }

  public clear() {
    this.searchSettings.clear();

    // Notify Observers
    this.searchChangeBehavior.next(this);
  }

  // Merges the data for two search models; and returns a new instance. Observables
  // are not included.
  //
  public merge(otherFilter:SearchModel<T>) {

    let filter = Object.assign({}, this.search, otherFilter.search) as T;
    let settings:string[] = [];

    // Keep only used settings
    this.searchSettings.forEach((setting, key, map) => {
      if (setting) {
        settings.push(key);
      }
    });

    otherFilter.searchSettings.forEach((setting, key, map) => {
      if (setting) {
        settings.push(key);
      }
    });

    return new SearchModel(filter, settings);
  }
}

// TODO: Move this to a global object extension
export class SearchModelFilter<T extends RepositoryEntity> {

  public static apply<T extends RepositoryEntity>(entity:T, filter:SearchModel<T>) {

    let success = true;

    filter.searchSettings.forEach((setting, key, map) => {
      if (setting) {

        // This particular key must exist
        let theKey = key as keyof typeof entity;

        // Filter Match
        if (entity[theKey] !== filter.search[theKey]) {
          success = false;
        }
      }
    });

    return success;
  }
}
