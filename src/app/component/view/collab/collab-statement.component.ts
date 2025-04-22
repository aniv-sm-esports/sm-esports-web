import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: "collab-statement",
  templateUrl: "../../template/view/collab/collab-statement.component.html",
  imports: [
    RouterLink
  ]
})
export class CollabStatementComponent {

  constructor(protected readonly appService: AppService) {

  }
}
