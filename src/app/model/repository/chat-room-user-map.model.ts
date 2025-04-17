import {RepositoryEntity} from './repository-entity';

export class ChatRoomUserMap extends RepositoryEntity {
  userMap: Map<number, number>;

  constructor() {
    super();
    this.userMap = new Map();
  }

  add(userId: number, chatRoomId: number) {

    // Add
    if (!this.userMap.has(userId)) {
      this.userMap.set(userId, chatRoomId);
    }

    // Error
    else {
      console.log("Cannot add user:  user already belongs to another chat room");
    }
  }

  remove(userId: number) {

    // Remove
    if (this.userMap.has(userId)) {
      this.userMap.delete(userId);
    }

    // Error
    else {
      console.log("Cannot remove user:  user not found");
    }
  }
}
