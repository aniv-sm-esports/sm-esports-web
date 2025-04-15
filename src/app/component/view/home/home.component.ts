import {Component, Inject, NgZone} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {DOCUMENT, NgStyle} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {ZoomComponent} from '../../zoom.component';

@Component({
  selector: 'home',
  imports: [
    RouterLink,
    NgStyle,
    ZoomComponent,
    RouterOutlet
  ],
  templateUrl: '../../template/view/home/home.component.html'
})
export class HomeComponent {

  constructor(protected readonly router:Router) {
    router.navigate(['home/online']);
  }
}
