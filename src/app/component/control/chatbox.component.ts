import {Component, Input, SimpleChanges} from '@angular/core';
import {ChatService} from '../../service/chat.service';
import {ChatRoom} from '../../model/repository/entity/chat-room.model';
import {FormsModule} from '@angular/forms';
import {formatDate, NgClass, NgForOf} from '@angular/common';
import {Chat} from '../../model/repository/entity/chat.model';
import {noop} from 'rxjs';
import {BasicButtonComponent} from './primitive/button.component';
import {AuthService} from '../../service/auth.service';
import {AuthHandler} from '../../model/service/handler.model';
import {UserJWT} from '../../model/service/user-logon.model';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {ChatRoomService} from '../../service/chat-room.service';

@Component({
  selector: 'chatbox',
  imports: [
    FormsModule,
    NgForOf,
    BasicButtonComponent
  ],
  templateUrl: '../template/control/chatbox.component.html'
})
export class ChatBoxComponent implements AuthHandler {

  @Input('chatRoomId') chatRoomId: number | undefined;

  // Chat Service (Loaded off constructor stack)
  private chatService: ChatService | undefined;
  private chatServiceLoaded: boolean;

  // DOM Properties (for chat permissions and readiness)
  //
  protected userJWT: UserJWT;

  // DOM (template) USAGE
  protected readonly formatDate = formatDate;
  protected readonly noop = noop;

  // Chat Room
  public chatRoom:ChatRoom | undefined;
  public chats: Chat[] = [];

  // Chat Data
  public chatInput: string = '';

  constructor(private readonly http:HttpClient,
              private readonly authService:AuthService,
              private readonly chatRoomService:ChatRoomService) {

    this.chatServiceLoaded = false;

    // Must retrieve data from server
    this.chatRoom = ChatRoom.default();
    this.userJWT = UserJWT.default();

    // Subscribe for logon JWT (which contains user name)
    this.authService.subscribeLogonChanged(this);
  }

  // Lifecycle Hook:  Check for chatRoomId
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.hasOwnProperty('chatRoomId') && changes['chatRoomId']) {

      // -> Chat Room
      this.chatRoomService
        .getBy(room => room.id === Number(changes['chatRoomId']))
        .then(response => {

          // LOADED W/O CHAT DATA!
          if (response.length == 1) {
            this.chatRoom = response[0];
            this.chatService = new ChatService(this.http, response[0].id);
            this.chatServiceLoaded = true;
            this.refresh();
          }
          else {
            this.chatRoom = undefined;
            this.chatService = undefined;
            this.chatServiceLoaded = false;
            console.log("Error: Chat service not available for Chat Room: id(" + changes['chatRoomId'] + ")");
          }
        });
    }
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

    // Must check permissions status for chat visibility
    this.refresh();
  }

  submitChat() {

    if (!this.chatInput ||
         this.userJWT.isDefault() ||
        !this.chatServiceLoaded) {
      return;
    }

    this.chatService?.create(Chat.fromUserJWT(this.userJWT, this.chatInput))
        .then(response => {

          if (response != Chat.default()) {
            this.chatInput = '';

          }
          else {
            console.log('Chat post failed:  /api/chat/postChat/:chatRoomId');
          }
        });
  }

  refresh() {

    // Procedure
    //
    // 1) Verify ChatService Loaded
    // 2) *Verify UserJWT is loaded
    // 3) *Load chat messages if user is logged in
    //
    // TODO: Check chat permissions with server before loading messages
    //

    // Chat Room
    if (this.chatServiceLoaded) {

        this.chatService?.getAll().then(response => {
              this.chats = response;
        });
    }
    else {
      console.log('Chat service not available, or improperly loaded.');
    }
  }
}
