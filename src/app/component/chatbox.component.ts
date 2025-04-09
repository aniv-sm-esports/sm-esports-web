import {Component, Input, SimpleChanges} from '@angular/core';
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
import {AuthService} from '../service/auth.service';
import {AuthHandler} from '../model/handler.model';
import {UserJWT} from '../model/user-logon.model';
import {ActivatedRoute, Router} from '@angular/router';

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
export class ChatBoxComponent implements AuthHandler {

  // Services
  private readonly chatService: ChatService;
  private readonly authService: AuthService;

  // DOM Properties (for chat permissions and readiness)
  //
  protected userJWT: UserJWT;

  // DOM (template) USAGE
  protected readonly formatDate = formatDate;
  protected readonly noop = noop;

  // Chat Room
  public chatRoom:ChatRoom;

  // Chat Data
  public chatInput: string = '';

  constructor(activatedRoute:ActivatedRoute, authService:AuthService, chatService: ChatService) {

    this.authService = authService;
    this.chatService = chatService;

    // Must retrieve data from server
    this.chatRoom = ChatRoom.default();
    this.userJWT = UserJWT.default();

    // Subscribe for logon JWT (which contains user name)
    this.authService.subscribeLogonChanged(this);

    // Get chatRoomName from URL
    if (activatedRoute.snapshot?.url.length == 1) {

      let chatRoomName =  activatedRoute.snapshot?.url[0].path;

      // Initialize Chat Room
      this.chatService
        .getChatRoom(chatRoomName)
        .subscribe(response => {

          if (response.response == ApiResponseType.Success) {
            this.chatRoom.update(response.data as ChatRoom);

            this.refreshChats();
          }
        });
    }
    else
      console.log('URL for chat box component needs to be updated: URL segment mismatch for chatRoomName');
  }

  // Procedure:
  //
  // 1) Verify User Identity / Logon Information        (May be required for personal chat rooms)
  // 2) Get ChatRoom from the chatRoomRoute input
  // 3) Verify User has permissions to the chat room    (Read / Write Permissions)
  // 4) Show UI accordingly                             (Show, ShowReadOnly, RedirectToLogon, ShowPermissionDenied, ShowBanned)
  //
  onLoginChanged(value:UserJWT){
    this.userJWT = value;
  }

  submitChat() {

    if (!this.chatInput ||
         this.userJWT.isDefault() ||
         this.chatRoom.isDefault()) {
      return;
    }

    this.chatService
        .postChat(this.chatRoom.id, Chat.fromUserJWT(this.userJWT, this.chatInput))
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
