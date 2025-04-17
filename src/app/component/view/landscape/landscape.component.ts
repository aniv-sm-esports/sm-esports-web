import {Component} from '@angular/core';
import { AppService } from '../../../service/app.service';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: "landscape",
  templateUrl: "../../template/view/landscape/landscape.component.html",
    imports: [
        RouterOutlet
    ]
})
export class LandscapeComponent {

  constructor(protected readonly appService: AppService) {

  }
}
