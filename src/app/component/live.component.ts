import {Component} from '@angular/core';
import {NgOptimizedImage, NgStyle} from '@angular/common';
import { AppService } from '../service/app.service';
import {ChatBoxComponent} from './control/chatbox.component';

@Component({
  selector: "live",
  templateUrl: "./template/live.component.html",
  imports: [
    NgOptimizedImage,
    NgStyle,
    ChatBoxComponent
  ]
})
export class LiveComponent {

  constructor(protected readonly appService: AppService) {

  }
}
