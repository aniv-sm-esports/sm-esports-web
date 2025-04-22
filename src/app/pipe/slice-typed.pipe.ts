import { Pipe, PipeTransform } from '@angular/core';
import {RepositoryEntity} from '../model/repository/repository-entity';

@Pipe({
  name: 'sliceTyped',
  pure: false
})
export class SlicePipeTyped<T extends RepositoryEntity> implements PipeTransform {

  transform(items: T[], low:number, high:number): any {
    if (!items) {
      return items;
    }

    return items.slice(low, high);
  }
}
