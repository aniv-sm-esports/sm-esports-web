import { Pipe, PipeTransform } from '@angular/core';
import {RepositoryEntity} from '../model/repository/repository-entity';
import lodash, { Dictionary } from 'lodash';
import {Selector} from '../model/service/handler.model';

@Pipe({
  name: 'groupByFirst',
  pure: false
})
export class GroupByFirstPipe<TResult, TKey, T> implements PipeTransform {

  transform(items: T[], keySelector:Selector<TKey,  T>, selector:Selector<TResult, T>) {
    if (!items) {
      return items;
    }

    let grouped = lodash.groupBy(items, item => { return keySelector(item); });

    return lodash.flatMap(grouped, array => {
      return array.map(item => { return selector(item)})[0];
    });
  }
}
