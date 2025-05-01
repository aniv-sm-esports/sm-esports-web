import {Entity} from '../entity/model/Entity';
import {PageData} from './page-data.model';

export class ServerData<T> {

  public data: T[] = [];

  constructor(data: T[]) {
    this.data = data;
  }

  public static default<T>() {
    return new ServerData<T>([]);
  }
}
export class ServerEntityData<T extends Entity<T>> extends ServerData<T> {

  public pageData:PageData;

  constructor(data: T[], pageData:PageData) {
    super(data);
    this.pageData = pageData;
  }
}
