import {Component} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Tab} from '../model/tab.model';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ChatService} from '../service/chat.service';

@Component({
  selector: 'chat',
  imports: [
    NgForOf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './template/chat.component.html'
})
export class ChatComponent {

  private readonly chatService: ChatService;
  private readonly baseRoute:string = 'chat';

  public chatTabs: Tab[];
  public selectedChatTab: Tab | undefined;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
    this.chatTabs = [];
  }

  ngOnInit() {
    this.chatService
        .getChatRooms()
        .subscribe(response =>{

          // Clear tabs
          this.chatTabs = [];

          // Add tabs from response
          response.data?.forEach(room => {
            this.chatTabs.push(new Tab(room.name, this.baseRoute + '/' + room.urlRoute));
          });
        });
  }
}
