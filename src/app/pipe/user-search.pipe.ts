import { Pipe, PipeTransform } from '@angular/core';
import {SearchModel, SearchModelFilter} from '../model/repository/search.model'
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
      return SearchModelFilter.apply(item, filter as SearchModel<T>);
    });
  }
}
