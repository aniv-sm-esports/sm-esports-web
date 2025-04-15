import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';

@Component({
  selector: "landscape-links",
  templateUrl: "../../template/view/landscape/landscape-links.component.html",
  imports: [
  ]
})
export class LandscapeLinksComponent {

  constructor(protected readonly appService: AppService) {

  }
}
