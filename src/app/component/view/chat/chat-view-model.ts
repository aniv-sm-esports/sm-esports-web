import { ChatCategory } from "../../../model/repository/entity/chat-category.model";
import {ChatGroup} from '../../../model/repository/entity/chat-group.model';
import {ChatRoom} from '../../../model/repository/entity/chat-room.model';

// TEMPORARY VIEW OBJECT (flattened table object, TBD)
export class ChatCategoryViewModel {

  category: ChatCategory = ChatCategory.default();
  groups: ChatGroup[] = [];
  selected:boolean = false;

  constructor(chatCategory:ChatCategory, chatGroup:ChatGroup[]) {
    this.category = chatCategory;
    this.groups = chatGroup;
  }
}

export class ChatGroupViewModel {
  group: ChatGroup = ChatGroup.default();
  rooms: ChatRoom[] = [];
  selected: boolean = false;

  constructor(chatGroup:ChatGroup, chatRooms:ChatRoom[]) {
    this.group = chatGroup;
    this.rooms = chatRooms;
  }
}
