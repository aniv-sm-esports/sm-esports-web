import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';

@Component({
  selector: "landscape",
  templateUrl: "../../template/view/landscape/landscape.component.html",
  imports: [
  ]
})
export class LandscapeComponent {

  constructor(protected readonly appService: AppService) {

  }
}
