import { RepositoryEntity } from "../repository-entity";

export class ChatGroupRoomMap extends RepositoryEntity {

  public chatGroupId: number = 0;
  public chatRoomId: number = 0;

  update<T extends RepositoryEntity>(entity: T): void {
    Object.assign(this, entity);
  }

  public static from(id: number, chatGroupId: number, chatRoomId:number): ChatGroupRoomMap {
    let result:ChatGroupRoomMap = new ChatGroupRoomMap();
    result.id = id;
    result.chatGroupId = chatGroupId;
    result.chatRoomId = chatRoomId;
    return result;
  }

  public static default() {
    return new ChatGroupRoomMap();
  }
}
