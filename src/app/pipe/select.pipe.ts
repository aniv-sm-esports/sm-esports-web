import { Pipe, PipeTransform } from '@angular/core';
import {Entity} from '../../server/entity/model/Entity';

@Pipe({
  name: 'select',
  pure: false
})
export class SelectPipe<T extends Entity<T>, TResult> implements PipeTransform {

  transform(items: T[], key:keyof T) : TResult[] {
    if (!items) {
      return items;
    }

    return items.map(item => { return item[key] as TResult; });
  }
}
