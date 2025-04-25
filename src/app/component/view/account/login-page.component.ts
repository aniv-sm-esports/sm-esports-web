import { Component } from "@angular/core";
import {Router} from '@angular/router';
import {AppService} from '../../../service/app.service';
import {LoginComponent} from '../../control/login.component';

@Component({
  selector: 'login-page',
  imports: [
    LoginComponent
  ],
  templateUrl: '../../template/view/account/login-page.component.html'
})
export class LoginPageComponent {

  constructor(protected readonly router:Router,
              protected readonly appService:AppService) {
  }
}
