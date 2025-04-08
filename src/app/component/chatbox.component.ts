import {Component, Input} from '@angular/core';
import {ChatService} from '../service/chat.service';
import {ChatRoom} from '../model/chat-room.model';
import {FormsModule} from '@angular/forms';
import {User} from '../model/user.model';
import {formatDate, NgClass, NgForOf} from '@angular/common';
import {Chat} from '../model/chat.model';
import {noop} from 'rxjs';
import {BasicButtonComponent} from './button.component';
import {UserService} from '../service/user.service';
import {ApiResponseType} from '../model/app.model';

@Component({
  selector: 'chatbox',
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    BasicButtonComponent
  ],
  templateUrl: './template/chatbox.component.html'
})
export class ChatBoxComponent {

  // Chat Activation:  Must input chatRoomName on the DOM
  //
  @Input() chatRoomName!:string;

  // Services
  private readonly chatService: ChatService;
  private readonly userService: UserService;

  // DOM Properties (for chat permissions and readiness)
  //
  protected loading: boolean = true;
  protected chatRoomExists: boolean = false;
  protected userVerified: boolean = false;

  // DOM (template) USAGE
  protected readonly formatDate = formatDate;
  protected readonly noop = noop;

  // Chat Room
  public chatRoom:ChatRoom;

  // Chat Data
  public user: User | undefined;
  public chatInput: string = '';

  constructor(userService:UserService, chatService: ChatService) {

    this.userService = userService;
    this.chatService = chatService;

    // Must retrieve data from server
    this.chatRoom = new ChatRoom();
  }

  // Procedure:
  //
  // 1) Verify User Identity / Logon Information        (May be required for personal chat rooms)
  // 2) Get ChatRoom from the chatRoomRoute input
  // 3) Verify User has permissions to the chat room    (Read / Write Permissions)
  // 4) Show UI accordingly                             (Show, ShowReadOnly, RedirectToLogon, ShowPermissionDenied, ShowBanned)
  //
  ngOnInit() {

    this.chatService
      .getChatRoom(this.chatRoomName)
      .subscribe(response => {

        if (response.response == ApiResponseType.Success) {
          this.chatRoom.update(response.data as ChatRoom);

          this.refreshChats();
          this.loading = false;
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

          if (response.response == ApiResponseType.Success) {
            this.chatInput = '';
            this.refreshChats();
          }
          else {
            console.log('Chat post failed:  /api/chat/postChat/:chatRoomId');
          }
        });
  }

  refreshChats() {

    // TODO: Don't reset chat array here; but figure out a smooth way transitionally
    this.chatRoom.clearChats();

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
