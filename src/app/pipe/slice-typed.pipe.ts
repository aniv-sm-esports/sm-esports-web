import { Pipe, PipeTransform } from '@angular/core';
import { Entity } from '../../server/entity/model/Entity';

@Pipe({
  name: 'sliceTyped',
  pure: false
})
export class SlicePipeTyped<T extends Entity<T>> implements PipeTransform {

  transform(items: T[], low:number, high:number): any {
    if (!items) {
      return items;
    }

    return items.slice(low, high);
  }
}
