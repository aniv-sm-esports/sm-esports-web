import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';

@Component({
  selector: "landscape-media",
  templateUrl: "../../template/view/landscape/landscape-media.component.html",
  imports: [
  ]
})
export class LandscapeMediaComponent {

  constructor(protected readonly appService: AppService) {

  }
}
