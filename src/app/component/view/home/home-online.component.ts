import {Component} from '@angular/core';
import {NgOptimizedImage, NgStyle} from '@angular/common';
import { AppService } from '../../../service/app.service';
import {ChatBoxComponent} from '../../control/chatbox.component';

@Component({
  selector: "online",
  templateUrl: "../../template/view/home/home-online.component.html",
  imports: [
    NgOptimizedImage,
    NgStyle,
    ChatBoxComponent
  ]
})
export class HomeOnlineComponent {

  constructor(protected readonly appService: AppService) {

  }
}
