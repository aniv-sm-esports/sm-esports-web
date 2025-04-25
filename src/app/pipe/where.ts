import { Pipe, PipeTransform } from '@angular/core';
import lodash, { Dictionary } from 'lodash';
import {Predicate, Selector} from '../model/service/handler.model';

@Pipe({
  name: 'where',
  pure: false
})
export class WherePipe<T> implements PipeTransform {

  transform(item:T, items: T[], predicate:Predicate<T>, id:number) {
    if (!items) {
      return items;
    }

    return items.filter(item => {
      return predicate(item);
    });
  }
}
