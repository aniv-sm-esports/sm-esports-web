import {Component} from '@angular/core';
import {ChatRoomService} from '../../../service/chat-room.service'
import {ChatCategoryService} from '../../../service/chat-category.service';
import {ChatCategoryGroupMapService} from '../../../service/chat-category-group-map.service';
import {ChatGroupRoomMapService} from '../../../service/chat-group-room-map.service';
import {ChatGroupService} from '../../../service/chat-group.service';
import {ChatCategoryViewModel, ChatComponentViewModel, ChatGroupViewModel, ChatRoomViewModel} from './chat-view-model';
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
import lodash from 'lodash';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

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
    RouterLink,
    FaIconComponent
  ],
  templateUrl: '../../template/view/chat/chat.component.html'
})
export class ChatComponent {

  // (TEMPORARY) Use a pipe filter to get your chat category, and group collections.
  protected viewModel:ChatComponentViewModel;

  constructor(protected readonly appService: AppService,
              private readonly chatCategoryService:ChatCategoryService,
              private readonly chatGroupService:ChatGroupService,
              private readonly chatRoomService:ChatRoomService,
              private readonly chatCategoryGroupMapService: ChatCategoryGroupMapService,
              private readonly chatGroupRoomMapService:ChatGroupRoomMapService) {

    this.viewModel = new ChatComponentViewModel();

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
                        }
                        else {

                          let categoryViewModel = this.viewModel.chatCategories.find(x => x.category.id === category.id);
                          if (!categoryViewModel) {
                            categoryViewModel = new ChatCategoryViewModel(category, []);
                          }

                          let groupViewModel = categoryViewModel.groups.find(x => x.group.id === group.id);
                          if (!groupViewModel) {
                            groupViewModel = new ChatGroupViewModel(group, []);
                          }

                          let roomViewModel = groupViewModel.rooms.find(x => x.room.id === room.id);
                          if (!roomViewModel) {
                            roomViewModel = new ChatRoomViewModel(room);
                          }

                          if (!groupViewModel.rooms.find(x => x.room.id === roomViewModel?.room?.id)) {
                            groupViewModel.rooms.push(roomViewModel);
                          }
                          if (!categoryViewModel.groups.find(x => x.group.id === groupViewModel?.group?.id)) {
                            categoryViewModel.groups.push(groupViewModel);
                          }

                          if (!this.viewModel.chatCategories.find(x => x.category.id === categoryViewModel?.category?.id)) {
                            this.viewModel.chatCategories.push(categoryViewModel);
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

  public selectChatRoom(chatRoomId:number) {

    let groups = lodash.flatten(this.viewModel.chatCategories.map(category => { return category.groups;}));
    let rooms = lodash.flatten(groups.map(group => group.rooms));

    this.viewModel.selectedChatRoom = rooms.find(model => { return model.room.id === chatRoomId; });
  }
}
