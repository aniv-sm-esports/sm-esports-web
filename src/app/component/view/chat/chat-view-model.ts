import { ChatCategory } from "../../../model/repository/entity/chat-category.model";
import {ChatGroup} from '../../../model/repository/entity/chat-group.model';
import {ChatRoom} from '../../../model/repository/entity/chat-room.model';

// TEMPORARY VIEW OBJECT (flattened table object, TBD)
export class ChatRoomViewModel {
  chatCategory:ChatCategory = ChatCategory.default();
  chatGroup:ChatGroup = ChatGroup.default();
  chatRoom:ChatRoom = ChatRoom.default();

  constructor(chatCategory:ChatCategory, chatGroup:ChatGroup, chatRoom:ChatRoom) {
    this.chatCategory = chatCategory;
    this.chatGroup = chatGroup;
    this.chatRoom = chatRoom;
  }
}
