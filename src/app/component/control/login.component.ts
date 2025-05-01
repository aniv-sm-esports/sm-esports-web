import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {FormsModule} from '@angular/forms';
import {BasicButtonComponent} from './primitive/button.component';
import {AppService} from '../../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {noop} from 'rxjs';
import {AuthHandler} from '../../model/service/handler.model';
import {UserCredentialClientDTO} from '../../model/client-dto/UserCredentialClientDTO';
import {UserJWTClientDTO} from '../../model/client-dto/UserJWTClientDTO';
import {UserJWT} from '../../../server/entity/model/UserJWT';

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

  @Output('formFinished') formFinished: EventEmitter<UserJWTClientDTO> = new EventEmitter();

  protected readonly noop = noop;

  public userLogon:UserCredentialClientDTO = new UserCredentialClientDTO();
  public userFormValid: boolean = false;

  constructor(protected readonly appService:AppService,
              private readonly authService: AuthService) {
    this.userFormValid = false;

    this.authService.subscribeLogonChanged(this);
  }

  // Server Subscription
  onLoginChanged(value:UserJWT) {
    // Nothing to do. Other listeners will handle navigation
  }

  login(){

    // Already Logged On
    if (this.appService.primaryUserLoggedOn) {
      console.log("User Already Logged On");
      return;
    }

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
