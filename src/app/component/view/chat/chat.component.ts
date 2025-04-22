import {Component} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Tab} from '../../../model/view/tab.model';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ChatService} from '../../../service/chat.service';
import {BasicButtonComponent} from '../../control/primitive/button.component';
import {ChatBoxComponent} from '../../control/chatbox.component';
import {ChatRoomService} from '../../../service/chat-room.service'

@Component({
  selector: 'chat',
  imports: [
    NgForOf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    BasicButtonComponent,
    ChatBoxComponent
  ],
  templateUrl: '../../template/view/chat/chat.component.html'
})
export class ChatComponent {

  private readonly baseRoute:string = '/chat';

  public chatTabs: Tab[];
  public selectedChatTab: Tab | undefined;

  constructor(private readonly router:Router,
              private readonly chatRoomService:ChatRoomService) {

    this.chatTabs = [];

    this.chatRoomService
        .getAll()
        .then(response =>{

          // Clear tabs
          this.chatTabs = [];

          // Add tabs from response
          response.forEach(room => {
            this.chatTabs.push(Tab.from(room.name, room.urlRoute));
          });
        });
  }

  ngOnInit() {
  }

  navigateRoute(route: string) {
    this.router.navigate([this.baseRoute + '/' + route]);``
  }
}
