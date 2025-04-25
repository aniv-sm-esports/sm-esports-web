import {Component, EventEmitter, Output} from '@angular/core';
import {UserCredentials, UserJWT} from '../../model/service/user-logon.model';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {FormsModule} from '@angular/forms';
import {BasicButtonComponent} from './primitive/button.component';
import {AppService} from '../../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {noop} from 'rxjs';
import {AuthHandler} from '../../model/service/handler.model';
import {UserCreation} from '../../model/view/user-creation.model';

@Component({
  selector: 'login',
  imports: [
    FormsModule,
    BasicButtonComponent,
    RouterLink
  ],
  templateUrl: '../template/control/login.component.html'
})
export class LoginComponent implements AuthHandler {

  @Output('formFinished') formFinished: EventEmitter<UserJWT> = new EventEmitter();

  protected readonly noop = noop;

  public userLogon:UserCredentials = new UserCredentials();
  public userFormValid: boolean = false;

  constructor(protected readonly appService:AppService,
              private readonly authService: AuthService) {
    this.userFormValid = false;

    this.authService.subscribeLogonChanged(this);
  }

  onLoginChanged(value:UserJWT) {

    if (value) {
      // Notify Listener(s)
      this.formFinished.emit(value);
    }
    else {
      return;
    }
  }

  login(){

    // Already Logged On
    if (this.appService.primaryUserLoggedOn)
      this.formFinished.emit(this.appService.primaryUserLogon);

    // Logon Mode + User Form Valid -> Logon
    //
    else if (this.userFormValid) {

      // Call Auth Service
      this.authService.logon(this.userLogon.userName, this.userLogon.password);
    }
  }

  onFormInput(){
      this.userFormValid = !!this.userLogon.userName && !!this.userLogon.password;
  }
}
