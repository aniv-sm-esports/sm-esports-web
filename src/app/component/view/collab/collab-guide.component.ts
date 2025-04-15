import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';

@Component({
  selector: "collab-guide",
  templateUrl: "../../template/view/collab/collab-guide.component.html",
  imports: [
  ]
})
export class CollabGuideComponent {

  constructor(protected readonly appService: AppService) {

  }
}
