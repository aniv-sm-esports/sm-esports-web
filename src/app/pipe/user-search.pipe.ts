import { Pipe, PipeTransform } from '@angular/core';
import { SearchModel } from '../model/service/search.model'
import {RepositoryEntity} from '../model/repository/repository-entity';

@Pipe({
  name: 'userSearch',
  pure: false
})
export class UserSearchPipe<T extends RepositoryEntity> implements PipeTransform {

  private propertyNames: string[] = [];

  transform(items: T[], filter: SearchModel<T>): any {
    if (!items || !filter) {
      return items;
    }

    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => {
      return this.doesFilterPass(item, filter as SearchModel<T>);
    });
  }

  // TODO: SHARE THIS WITH REPOSITORY
  private doesFilterPass(entity:T, filter:SearchModel<T>) {

    let success = true;

    // Cache property names for performance
    if (this.propertyNames.length == 0) {
      Object.getOwnPropertyNames(entity).forEach(propertyName => {

        // Just choose properties that have a value
        let theKey = propertyName as keyof typeof entity;

        // Property Search Defined  // TODO: Serialization not working for the functions. Probably need interface (?)
        if (!!filter.searchMap[propertyName]) {
          this.propertyNames.push(propertyName);
        }
      });
    }

    // Property Filter
    this.propertyNames.forEach(key => {

      // This particular key must exist
      let theKey = key as keyof typeof entity;

      // Regex
      let regex = new RegExp(filter.searchMap[key]);

      // Filter Match
      if (!String(entity[theKey]).match(regex)) {
        success = false;
      }
    });

    return success;
  }
}
