import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {faCircle, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {LoginComponent} from './login.component';
import moment from 'moment/moment';
import {ClickOutsideDirective} from '../../directive/click-outside.directive';
import {UserService} from '../../service/user.service';
import {AppService} from '../../service/app.service';

@Component({
  selector: 'user-dropdown',
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
    FaIconComponent,
    NgClass,
    LoginComponent,
    NgIf,
    ClickOutsideDirective
  ],
  templateUrl: '../template/control/user-dropdown.component.html'
})
export class UserDropdownComponent {

  @Input('user-dropdown-show') showDropdown!:boolean;

  protected readonly faCircle = faCircle;
  protected readonly faGithub = faGithub;
  protected readonly faEnvelope = faEnvelope;
  protected readonly moment = moment;

  constructor(private readonly router:Router, protected readonly appService:AppService) {

  }

  onOffClick() {
    this.showDropdown = false;
  }
}
