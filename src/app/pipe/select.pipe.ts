import { Pipe, PipeTransform } from '@angular/core';
import {RepositoryEntity} from '../model/repository/repository-entity';
import lodash from 'lodash';

@Pipe({
  name: 'select',
  pure: false
})
export class SelectPipe<T extends RepositoryEntity, TResult> implements PipeTransform {

  transform(items: T[], key:keyof T) : TResult[] {
    if (!items) {
      return items;
    }

    return items.map(item => { return item[key] as TResult; });
  }
}
