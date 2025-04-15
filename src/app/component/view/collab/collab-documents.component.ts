import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';

@Component({
  selector: "collab-documents",
  templateUrl: "../../template/view/collab/collab-documents.component.html",
  imports: [
  ]
})
export class CollabDocumentsComponent {

  constructor(protected readonly appService: AppService) {

  }
}
