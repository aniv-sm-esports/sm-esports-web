import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ChatRoomService} from '../../../service/chat-room.service'

@Component({
  selector: 'chat-security',
  imports: [
  ],
  templateUrl: '../../template/view/chat/chat-security.component.html'
})
export class ChatSecurityComponent {

  constructor(private readonly router:Router,
              private readonly chatRoomService:ChatRoomService) {

  }
}
