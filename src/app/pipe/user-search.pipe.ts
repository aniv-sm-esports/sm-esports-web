import { Pipe, PipeTransform } from '@angular/core';
import {Entity} from '../../server/entity/model/Entity';
import {EntityCacheSearch, ServerSearchModelFilter} from '../../server/entity/entity-cache-search';

@Pipe({
  name: 'userSearch',
  pure: false
})
export class UserSearchPipe<T extends Entity<T>> implements PipeTransform {

  private propertyNames: string[] = [];

  transform(items: T[], filter: EntityCacheSearch<T>): any {
    if (!items || !filter) {
      return items;
    }

    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => {
      return ServerSearchModelFilter.apply(item, filter as EntityCacheSearch<T>);
    });
  }
}
