import {RepositoryEntity} from '../repository-entity';

export class ChatCategory extends RepositoryEntity {

  public name:string = '';
  public description:string = '';

  update<T extends RepositoryEntity>(entity: T): void {
    Object.assign(this, entity);
  }

  public static from(name:string, description:string): ChatCategory {
    let result:ChatCategory = new ChatCategory();
    result.name = name;
    result.description = description;
    return result;
  }

  public static default() {
    return new ChatCategory();
  }
}
