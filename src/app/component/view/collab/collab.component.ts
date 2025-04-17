import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: "collab",
  templateUrl: "../../template/view/collab/collab.component.html",
  imports: [
    RouterOutlet
  ]
})
export class CollabComponent {

  constructor(protected readonly appService: AppService) {

  }
}
