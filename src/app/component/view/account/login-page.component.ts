import { Component } from "@angular/core";
import {Location} from "@angular/common";
import {Router} from '@angular/router';
import {AppService} from '../../../service/app.service';
import {LoginComponent} from '../../control/login.component';
import {UserJWT} from '../../../model/service/user-logon.model';

@Component({
  selector: 'login-page',
  imports: [
    LoginComponent
  ],
  templateUrl: '../../template/view/account/login-page.component.html'
})
export class LoginPageComponent {

  constructor(protected readonly location:Location,
              protected readonly router:Router,
              protected readonly appService:AppService) {
  }

  onLoginSubmit(userJWT:UserJWT) {
    if (this.location) {
      this.location.back();
    }
    else {
      this.router.navigate(['/home/news']);
    }
  }
}
