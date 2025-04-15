import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';

@Component({
  selector: "collab",
  templateUrl: "../../template/view/collab/collab.component.html",
  imports: [
  ]
})
export class CollabComponent {

  constructor(protected readonly appService: AppService) {

  }
}
