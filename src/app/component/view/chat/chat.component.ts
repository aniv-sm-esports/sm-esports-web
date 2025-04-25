import {Component} from '@angular/core';
import {ChatRoomService} from '../../../service/chat-room.service'
import {ChatCategoryService} from '../../../service/chat-category.service';
import {ChatCategoryGroupMapService} from '../../../service/chat-category-group-map.service';
import {ChatGroupRoomMapService} from '../../../service/chat-group-room-map.service';
import {ChatGroupService} from '../../../service/chat-group.service';
import {ChatCategoryViewModel, ChatGroupViewModel} from './chat-view-model';
import {ChatBoxComponent} from '../../control/chatbox.component';
import {NgClass, NgForOf, NgStyle} from '@angular/common';
import {GroupByFirstPipe} from '../../../pipe/group-by-first.pipe';
import {Selector} from '../../../model/service/handler.model';
import { AppService } from '../../../service/app.service';
import {ChatCategory} from '../../../model/repository/entity/chat-category.model';
import {ChatRoom} from '../../../model/repository/entity/chat-room.model';
import {GroupByGroupPipe} from '../../../pipe/group-by-group';
import {WherePipe} from '../../../pipe/where';
import {ChatGroup} from '../../../model/repository/entity/chat-group.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'chat',
  imports: [
    ChatBoxComponent,
    NgForOf,
    GroupByFirstPipe,
    NgStyle,
    GroupByGroupPipe,
    WherePipe,
    NgClass,
    RouterLink
  ],
  templateUrl: '../../template/view/chat/chat.component.html'
})
export class ChatComponent {

  // (TEMPORARY) Use a pipe filter to get your chat category, and group collections.
  protected chatCategories:ChatCategoryViewModel[] = [];
  protected chatGroups:ChatGroupViewModel[] = [];

  protected selectedChatGroup:ChatGroupViewModel | undefined;
  protected selectedChatRoom:ChatRoom | undefined;

  constructor(protected readonly appService: AppService,
              private readonly chatCategoryService:ChatCategoryService,
              private readonly chatGroupService:ChatGroupService,
              private readonly chatRoomService:ChatRoomService,
              private readonly chatCategoryGroupMapService: ChatCategoryGroupMapService,
              private readonly chatGroupRoomMapService:ChatGroupRoomMapService) {

    // Why use a view? :)
    this.chatCategoryService.getAll().then(categories => {
      this.chatGroupService.getAll().then(groups => {
        this.chatRoomService.getAll().then(rooms => {
          this.chatGroupRoomMapService.getAll().then(groupRooms => {
            this.chatCategoryGroupMapService.getAll().then(categoryGroups => {

              rooms.forEach(room => {
                groupRooms
                  .filter(map => {
                    return map.chatRoomId == room.id;
                  })
                  .forEach(map => {
                    categoryGroups
                      .filter(categoryMap => {
                        return categoryMap.chatGroupId == map.chatGroupId
                      })
                      .forEach(categoryMap => {

                        let category = categories.find(x => x.id === categoryMap.chatCategoryId);
                        let group = groups.find(x => x.id === categoryMap.chatGroupId);

                        if (!room || !group || !category) {
                          console.log("Error: Mismatched chat data!");
                        } else {
                          let existingCategory = this.chatCategories.find(x => x.category.id === category.id);
                          if (existingCategory) {
                            existingCategory.groups.push(group);
                          }
                          else {
                            this.chatCategories.push(new ChatCategoryViewModel(category, [group]));
                          }

                          let existingGroup = this.chatGroups.find(x => x.group.id === group.id);
                          if (existingGroup) {
                            existingGroup.rooms.push(room);
                          }
                          else {
                            this.chatGroups.push(new ChatGroupViewModel(group, [room]));
                          }
                        }
                      });
                  });
              });
            });
          });
        });
      });
    });
  }

  public selectGroup(chatGroupId:number) {
    this.selectedChatGroup = this.chatGroups.find(x => x.group.id === chatGroupId);

    this.chatGroups.forEach(chatGroup => {
      chatGroup.selected = chatGroup.group.id === chatGroupId;
    });

    this.chatCategories.forEach(category => {
      category.selected = category.groups.some(x => x.id === chatGroupId);
    });

    // Un-Select Chat Room
    //this.selectedChatRoom = undefined;
  }

  public selectChatRoom(chatRoomId:number) {
    this.selectedChatRoom = this.selectedChatGroup?.rooms?.find(x => x.id === chatRoomId);
  }
}
