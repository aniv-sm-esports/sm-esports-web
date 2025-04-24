import { RepositoryEntity } from "../repository-entity";

export class ChatCategoryGroupMap extends RepositoryEntity {

  public chatCategoryId: number = 0;
  public chatGroupId: number = 0;

  update<T extends RepositoryEntity>(entity: T): void {
    Object.assign(this, entity);
  }

  public static from(id: number, chatCategoryId: number, chatGroupId:number): ChatCategoryGroupMap {
    let result:ChatCategoryGroupMap = new ChatCategoryGroupMap();
    result.id = id;
    result.chatCategoryId = chatCategoryId;
    result.chatGroupId = chatGroupId;
    return result;
  }

  public static default() {
    return new ChatCategoryGroupMap();
  }
}
