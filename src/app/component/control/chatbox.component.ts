import {Component, Input, SimpleChanges} from '@angular/core';
import {ChatService} from '../../service/chat.service';
import {ChatRoom} from '../../model/repository/entity/chat-room.model';
import {FormsModule} from '@angular/forms';
import {formatDate, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {Chat} from '../../model/repository/entity/chat.model';
import {noop} from 'rxjs';
import {BasicButtonComponent} from './primitive/button.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {ChatRoomService} from '../../service/chat-room.service';
import {AppService} from '../../service/app.service';

@Component({
  selector: 'chatbox',
  imports: [
    FormsModule,
    NgForOf,
    BasicButtonComponent,
    RouterLink,
    NgIf,
    NgStyle,
    NgClass
  ],
  templateUrl: '../template/control/chatbox.component.html'
})
export class ChatBoxComponent {

  @Input('chatRoomId') chatRoomId: number | undefined;
  @Input('height') height!:number;

  // Chat Service (Loaded off constructor stack)
  private chatService: ChatService | undefined;
  private chatServiceLoaded: boolean;

  // DOM (template) USAGE
  protected readonly formatDate = formatDate;
  protected readonly noop = noop;

  // Chat Room
  public chatRoom:ChatRoom | undefined;
  public chats: Chat[] = [];

  // Chat Data
  public chatInput: string = '';

  constructor(private readonly http: HttpClient,
              private readonly chatRoomService:ChatRoomService,
              protected readonly appService:AppService) {

    this.chatServiceLoaded = false;

    // Must retrieve data from server
    this.chatRoom = ChatRoom.default();
  }

  // Lifecycle Hook:  Check for chatRoomId
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.hasOwnProperty('chatRoomId') && changes['chatRoomId']) {

      // -> Chat Room
      this.chatRoomService
        .getBy(room => room.id === Number(changes['chatRoomId'].currentValue))
        .then(response => {

          // LOADED W/O CHAT DATA!
          if (response.length == 1) {
            this.chatRoom = response[0];
            this.chatService = new ChatService(this.http, response[0].id);
            this.chatService
                .onAllEntitiesChanged()                           // Auto-Refresh
                .subscribe(apiData => {
                  this.chats = apiData.data;
            });
            this.chatServiceLoaded = true;
            this.chatService
                .getAll()
                .then(data => {   // Initial Refresh
              this.chats = data;
            });
          }
          else {
            this.chatRoom = undefined;
            this.chatService = undefined;
            this.chatServiceLoaded = false;
            console.log("Error: Chat service not available for Chat Room: id(" + changes['chatRoomId'].currentValue + ")");
          }
        });
    }
  }

  submitChat() {

    if (!this.chatInput ||
        !this.chatServiceLoaded ||
        !this.appService.primaryUserLoggedOn) {
      return;
    }

    this.chatService?.create(Chat.fromUserJWT(this.appService.primaryUserLogon, this.chatInput))
        .then(response => {
            this.chatInput = '';
        })
        .catch(error => {
          console.log(error);
        });
  }
}
