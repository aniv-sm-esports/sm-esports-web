import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgStyle} from '@angular/common';
import {AppService} from '../service/app.service';

@Component({
  selector: 'home',
  imports: [
    RouterLink,
    NgStyle
  ],
  templateUrl: './template/home.component.html'
})
export class HomeComponent {

  constructor(protected appService: AppService) {

  }

}
