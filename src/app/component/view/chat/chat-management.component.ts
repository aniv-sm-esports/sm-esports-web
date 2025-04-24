import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ChatRoomService} from '../../../service/chat-room.service'
import {BasicButtonComponent} from '../../control/primitive/button.component';
import {ChatBoxComponent} from '../../control/chatbox.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'chat-management',
  imports: [
    BasicButtonComponent,
    ChatBoxComponent,
    NgForOf
  ],
  templateUrl: '../../template/view/chat/chat-management.component.html'
})
export class ChatManagementComponent {

  constructor(private readonly router:Router,
              private readonly chatRoomService:ChatRoomService) {

  }
}
