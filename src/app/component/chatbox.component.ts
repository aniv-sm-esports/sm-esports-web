import {Component} from '@angular/core';
import {ChatService} from '../service/chat.service';
import {ActivatedRoute} from '@angular/router';
import {ChatRoom} from '../model/chat-room.model';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {User} from '../model/user.model';
import {formatDate, NgForOf} from '@angular/common';
import {Chat} from '../model/chat.model';
import {noop} from 'rxjs';

@Component({
  selector: 'chatbox',
  imports: [
    FormsModule,
    MatButton,
    NgForOf
  ],
  templateUrl: './template/chatbox.component.html'
})
export class ChatBoxComponent {

  // Services
  private readonly chatService: ChatService;
  private readonly chatRoomRoute: string;

  // DOM (template) USAGE
  protected readonly formatDate = formatDate;
  protected readonly noop = noop;

  // Chat Room
  public chatRoom:ChatRoom;

  // Chat Data
  public user: User | undefined;
  public chatInput: string = '';

  constructor(chatService: ChatService, activatedRoute: ActivatedRoute) {

    // Must retrieve data from server
    this.chatRoom = new ChatRoom();

    // TODO: Active User
    this.user = new User(0, 'aniv-sm-esports');

    this.chatService = chatService;

    // Parse Chat Room Id (from URL) (Handling default as 'politics', should be reroute)
    //
    this.chatRoomRoute = activatedRoute.snapshot.paramMap.get('chatRoomRoute') || 'politics';
  }

  ngOnInit() {
    this.chatService
      .getChatRoom(this.chatRoomRoute)
      .subscribe(response => {

        if (response.success) {
          this.chatRoom.update(response.data as ChatRoom);

          this.refreshChats();
        }
      });
  }

  submitChat() {

    if (!this.chatInput || !this.user) {
      return;
    }

    let chatRoomId = this.chatRoom?.id || 0;
    let userId = this.user?.id || 0;
    let userName = this.user?.name || '';

    this.chatService
        .postChat(chatRoomId, Chat.fromUser(userId, userName, this.chatInput))
        .subscribe(response => {

          if (response.success) {
            this.chatInput = '';
            this.refreshChats();
          }
          else {
            console.log('Chat post failed:  /api/chat/postChat/:chatRoomId');
          }
        });
  }

  refreshChats() {

    let chatRoomId = this.chatRoom?.id || 0;

    this.chatService
        .getChats(chatRoomId)
        .subscribe(response => {

          response.data?.forEach(chat => {

            // Update
            if (this.chatRoom.containsChat(chat.id)) {
              let localChat = this.chatRoom.getChat(chat.id);
              if (localChat) {
                // TODO: Could not find function (?!?!)
                //localChat?.update(chat);
              }
            }

            // Add
            else {
              this.chatRoom.chats.push(chat);
            }
          });
        });
  }
}
