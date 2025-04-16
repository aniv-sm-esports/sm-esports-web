import {SearchModel} from '../service/search.model';
import {RepositoryEntity} from './repository-entity';
import moment, {Moment} from 'moment';

export class RepositoryState<T extends RepositoryEntity> {
  public recordCapacity: number;
  public lastRepositoryChange:Moment;

  // Filters are applied globally for this repository instance. Spawn child repositories for filtering
  // parent ones from the database.
  //
  public filter:SearchModel<T>;

  constructor(recordCapacity: number, filter:SearchModel<T>) {
    this.recordCapacity = recordCapacity;
    this.filter = filter;
    this.lastRepositoryChange = moment();
  }
}
