import {Component} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Tab} from '../../../model/view/tab.model';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ChatService} from '../../../service/chat.service';
import {BasicButtonComponent} from '../../control/primitive/button.component';

@Component({
  selector: 'chat',
  imports: [
    NgForOf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    BasicButtonComponent
  ],
  templateUrl: '../../template/chat/chat.component.html'
})
export class ChatComponent {

  private readonly router:Router;
  private readonly chatService: ChatService;
  private readonly baseRoute:string = '/chat';

  public chatTabs: Tab[];
  public selectedChatTab: Tab | undefined;

  constructor(router:Router, chatService: ChatService) {
    this.router = router;
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
          response.apiData.dataSet?.forEach(room => {
            this.chatTabs.push(Tab.from(room.name, room.urlRoute));
          });
        });
  }

  navigateRoute(route: string) {
    this.router.navigate([this.baseRoute + '/' + route]);``
  }
}
