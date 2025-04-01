import {Component} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Tab} from '../model/tab.model';
import {ChatBoxComponent} from './chatbox.component';

@Component({
  selector: 'chattab',
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    ChatBoxComponent
  ],
  templateUrl: './template/chattab.component.html'
})
export class ChatTabComponent {
  chatTabs = [new Tab('The Roman Empire', 'romanEmpire', 0),
    new Tab('Politics', 'politics', 1),
    new Tab('Trans Rights', 'trans-rights', 2),
    new Tab('Curious Christians', 'curious-christians', 3),
    new Tab('Project Development', 'project-development', 4),
    new Tab('SM Speed Running', 'sm-speed-running', 5),
    new Tab('Engagement', 'engagement', 6),
    new Tab('General', 'general', 7),];

  selectedChatTab: Tab;

  constructor() {
    this.selectedChatTab = this.chatTabs[0];
  }
}
