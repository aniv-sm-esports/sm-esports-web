import {Component} from '@angular/core';
import {AppService} from '../service/app.service';

@Component({
  selector: 'statement-of-purpose',
  templateUrl: './template/statement-of-purpose.component.html'
})
export class StatementOfPurposeComponent {

  protected readonly appService: AppService;

  constructor(appService: AppService) {

    this.appService = appService;

  }
}
