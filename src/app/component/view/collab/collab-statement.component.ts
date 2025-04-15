import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';

@Component({
  selector: "collab-statement",
  templateUrl: "../../template/view/collab/collab-statement.component.html",
  imports: [
  ]
})
export class CollabStatementComponent {

  constructor(protected readonly appService: AppService) {

  }
}
