
// TEMPORARY VIEW OBJECT (flattened table object, TBD)
import {ChatCategory} from '../../../../server/entity/model/ChatCategory';
import {ChatGroup} from '../../../../server/entity/model/ChatGroup';
import {ChatRoom} from '../../../../server/entity/model/ChatRoom';

export class ChatComponentViewModel {
  chatCategories:ChatCategoryViewModel[] = [];
  selectedChatRoom:ChatRoomViewModel | undefined;
}
export class ChatCategoryViewModel {

  category: ChatCategory = new ChatCategory();
  groups: ChatGroupViewModel[] = [];
  expanded:boolean = false;
  selected:boolean = false;

  constructor(chatCategory:ChatCategory, chatGroup:ChatGroupViewModel[]) {
    this.category = chatCategory;
    this.groups = chatGroup;
  }
}

export class ChatGroupViewModel {
  group: ChatGroup = new ChatGroup();
  rooms: ChatRoomViewModel[] = [];
  expanded:boolean = false;
  selected: boolean = false;

  constructor(chatGroup:ChatGroup, chatRooms:ChatRoomViewModel[]) {
    this.group = chatGroup;
    this.rooms = chatRooms;
  }
}

export class ChatRoomViewModel {
  room:ChatRoom = new ChatRoom();
  selected:boolean = false;

  constructor(room:ChatRoom) {
    this.room = room;
  }
}
