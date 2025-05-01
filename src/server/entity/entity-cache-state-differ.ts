import lodash from 'lodash';
import moment from 'moment';
import {EntityCacheSearch} from './entity-cache-search';
import {EntityCacheState} from './entity-cache-state';
import {EntityCacheStateData} from './entity-cache-state-data';
import {Entity} from './model/Entity';

export class EntityCacheStateDiffer<T extends Entity<T>> {

  // TODO: Get package component or use decorators for DTO classes
  //
  public static objectDiff<T extends Entity<T>>(object1: T, object2: T): boolean {

    // CRITICAL*** Type is deceptive! The object prototype will show differences! So, most
    //             well written diff tools will catch them; and we just need property or
    //             field comparison! (Actually, just fields.. with eventual decorators!)
    //
    let result = false;

    // NOTE***     Similar code to the search model filter
    Object.getOwnPropertyNames(object1).forEach(key => {

      // This particular key must exist
      let theKey = key as keyof typeof object1;

      // Q:  Does the theKey exist for another inheritance path for object2?

      // Filter Match:  Using lodash on just the properties. These may be nested; but for
      //                our DTO's, we still have shallow properties. Date was not compared
      //                properly (still).
      if (!lodash.isEqual(object1[theKey], object2[theKey])) {
        result = true;
        console.log("DIFF FIELD:  " + theKey.toString());
        console.log("OBJECT 1:    " + String(object1[theKey]));
        console.log("OBJECT 2:    " + String(object2[theKey]));
        console.log("MOMENT 1:    " + moment(String(object1[theKey])));
        console.log("MOMENT 2:    " + moment(String(object2[theKey])));
      }
    });

    return result;
  }

  // Diffs two filters - aware of JSON serialization incompleteness.
  public static filterDiff<T extends Entity<T>>(filter:EntityCacheSearch<T>, otherFilter:EntityCacheSearch<T>){

    let mapDiffers = false;

    filter.searchSettings.forEach((value, key, map) => {
      if (!otherFilter.searchSettings.has(key))
        mapDiffers = true;
      else {
        mapDiffers = mapDiffers || (value !== otherFilter.searchSettings.get(key));
      }
    });

    return this.objectDiff<T>(filter.search, otherFilter.search) || mapDiffers;
  }

  // Diffs two filters - aware of JSON serialization incompleteness.
  public static filterDataDiff<T extends Entity<T>>(filterSearch:T,
                                                           filterSearchSettings: string[],
                                                           otherFilterSearch:T,
                                                           otherFilterSearchSettings:string[]){

    let mapDiffers = false;

    filterSearchSettings.forEach((value, key, map) => {
      if (!otherFilterSearchSettings.some(x => x === value))
        mapDiffers = true;
    });

    // TEMPORARY DIFF ROUTINE:  Going to work on JSON serialization + type decorators + type diff (based on
    //                          decorators). There should be a normal solution using TypeDI / typestack, or
    //                          maybe any of the other libraries that seem complete. Angular should even have
    //                          a solution shared with node.
    //

    return this.objectDiff<T>(filterSearch, otherFilterSearch) || mapDiffers;
  }

  // Returns true if repository states differ; and must be matched before updating
  // data.
  public static stateDiff<T extends Entity<T>>(state:EntityCacheState<T>, otherState:EntityCacheState<T>) {
    return state.getKey() !== otherState.getKey() ||
      state.getEntityName() !== otherState.getEntityName() ||
      state.getUnFilteredRecordCapacity() !== otherState.getUnFilteredRecordCapacity() ||
      state.getFilteredRecordCapacity() !== otherState.getUnFilteredRecordCapacity() ||
      EntityCacheStateDiffer.filterDiff<T>(state.getFilter(), otherState.getFilter());
  }

  // Returns true if repository states differ; and must be matched before updating
  // data.
  public static stateDataDiff<T extends Entity<T>>(serverState:EntityCacheStateData<T>, clientState:EntityCacheStateData<T>) {

    return serverState.repositoryKey !== clientState.repositoryKey ||
      serverState.entityName !== clientState.entityName ||
      serverState.unfilteredRecordCapacity !== clientState.unfilteredRecordCapacity ||
      serverState.filteredRecordCapacity !== clientState.filteredRecordCapacity ||
      EntityCacheStateDiffer.filterDataDiff<T>(
        serverState.filterSearch,
        serverState.filterSearchSettings,
        clientState.filterSearch,
        clientState.filterSearchSettings);
  }
}
