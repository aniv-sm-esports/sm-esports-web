import {Component} from '@angular/core';
import {ChatRoomService} from '../../../service/chat-room.service'
import {ChatCategoryService} from '../../../service/chat-category.service';
import {ChatCategoryGroupMapService} from '../../../service/chat-category-group-map.service';
import {ChatGroupRoomMapService} from '../../../service/chat-group-room-map.service';
import {ChatGroupService} from '../../../service/chat-group.service';
import {ChatRoomViewModel} from './chat-view-model';
import {ChatBoxComponent} from '../../control/chatbox.component';
import {NgForOf, NgStyle} from '@angular/common';
import {GroupByFirstPipe} from '../../../pipe/group-by-first.pipe';
import {Selector} from '../../../model/service/handler.model';
import { AppService } from '../../../service/app.service';
import {ChatCategory} from '../../../model/repository/entity/chat-category.model';

@Component({
  selector: 'chat',
  imports: [
    ChatBoxComponent,
    NgForOf,
    GroupByFirstPipe,
    NgStyle
  ],
  templateUrl: '../../template/view/chat/chat.component.html'
})
export class ChatComponent {

  // (TEMPORARY) Use a pipe filter to get your chat category, and group collections.
  protected chatRoomViewModel:ChatRoomViewModel[] = [];

  protected selectedChatCategory:ChatCategory | undefined;
  protected selectedChatRoom:ChatRoomViewModel | undefined;

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
                          this.chatRoomViewModel.push(new ChatRoomViewModel(category, group, room));
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

  categoryIdSelector(viewModel:ChatRoomViewModel) {
    return viewModel.chatCategory.id;
  }
  categorySelector(viewModel:ChatRoomViewModel) {
    return viewModel.chatCategory;
  }
}
