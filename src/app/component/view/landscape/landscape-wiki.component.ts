import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';

@Component({
  selector: "landscape",
  templateUrl: "../../template/view/landscape/landscape-wiki.component.html",
  imports: [
  ]
})
export class LandscapeWikiComponent {

  constructor(protected readonly appService: AppService) {

  }
}
