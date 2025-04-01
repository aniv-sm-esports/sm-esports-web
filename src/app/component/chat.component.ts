import {Component} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Tab} from '../model/tab.model';
import {ChatBoxComponent} from './chatbox.component';

@Component({
  selector: 'chat',
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    ChatBoxComponent
  ],
  templateUrl: './template/chat.component.html'
})
export class ChatComponent {
  chatTabs = [
    new Tab('Politics', 'politics', 0),
    new Tab('Project Development', 'project-development', 1),
    new Tab('SM Speed Running', 'sm-speed-running', 2),
    new Tab('Engagement', 'engagement', 3),
    new Tab('General', 'general', 4),];

  selectedChatTab: Tab;

  constructor() {
    this.selectedChatTab = this.chatTabs[0];
  }
}
