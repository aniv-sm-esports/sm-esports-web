import {Component} from '@angular/core';
import {NgOptimizedImage, NgStyle} from '@angular/common';
import { AppService } from '../service/app.service';
import {ChatBoxComponent} from './chatbox.component';

@Component({
  selector: "online",
  templateUrl: "./template/online.component.html",
  imports: [
    NgOptimizedImage,
    NgStyle,
    ChatBoxComponent
  ]
})
export class OnlineComponent {

  constructor(protected readonly appService: AppService) {

  }
}
