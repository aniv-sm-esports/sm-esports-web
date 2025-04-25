import { ChatCategory } from "../../../model/repository/entity/chat-category.model";
import {ChatGroup} from '../../../model/repository/entity/chat-group.model';
import {ChatRoom} from '../../../model/repository/entity/chat-room.model';

// TEMPORARY VIEW OBJECT (flattened table object, TBD)
export class ChatComponentViewModel {
  chatCategories:ChatCategoryViewModel[] = [];
  selectedChatRoom:ChatRoomViewModel | undefined;
}
export class ChatCategoryViewModel {

  category: ChatCategory = ChatCategory.default();
  groups: ChatGroupViewModel[] = [];
  expanded:boolean = false;
  selected:boolean = false;

  constructor(chatCategory:ChatCategory, chatGroup:ChatGroupViewModel[]) {
    this.category = chatCategory;
    this.groups = chatGroup;
  }
}

export class ChatGroupViewModel {
  group: ChatGroup = ChatGroup.default();
  rooms: ChatRoomViewModel[] = [];
  expanded:boolean = false;
  selected: boolean = false;

  constructor(chatGroup:ChatGroup, chatRooms:ChatRoomViewModel[]) {
    this.group = chatGroup;
    this.rooms = chatRooms;
  }
}

export class ChatRoomViewModel {
  room:ChatRoom = ChatRoom.default();
  selected:boolean = false;

  constructor(room:ChatRoom) {
    this.room = room;
  }
}
