import {RepositoryEntity} from '../repository-entity';

export class ChatGroup extends RepositoryEntity {

  public name:string = '';
  public description:string = '';

  update<T extends RepositoryEntity>(entity: T): void {
    Object.assign(this, entity);
  }

  public static from(name:string, description:string): ChatGroup {
    let result:ChatGroup = new ChatGroup();
    result.name = name;
    result.description = description;
    return result;
  }

  public static default() {
    return new ChatGroup();
  }
}
