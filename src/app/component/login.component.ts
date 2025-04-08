import {Component} from '@angular/core';
import {UserCredentials, UserJWT} from '../model/user-logon.model';
import {AuthService} from '../service/auth.service';
import {User} from '../model/user.model';
import {UserService} from '../service/user.service';
import {FormsModule} from '@angular/forms';
import {BasicButtonComponent} from './button.component';
import {BasicCheckboxComponent} from './checkbox.component';
import {NgIf, NgStyle} from '@angular/common';
import {AppService} from '../service/app.service';
import {ScrollTrackerDirective} from '../directive/scroll-tracker.directive';
import {PictureChooserComponent} from './picture-chooser.component';
import {Router} from '@angular/router';
import {noop} from 'rxjs';
import {AuthHandler} from '../model/handler.model';

@Component({
  selector: 'login',
  imports: [
    FormsModule,
    BasicButtonComponent,
    BasicCheckboxComponent,
    NgStyle,
    ScrollTrackerDirective,
    PictureChooserComponent,
    NgIf
  ],
  templateUrl: './template/login.component.html'
})
export class LoginComponent implements AuthHandler {

  protected readonly appService: AppService;
  private readonly authService: AuthService;
  private readonly userService: UserService;
  private readonly router: Router;

  public createAccountMode:boolean = false;

  public userLogon:UserCredentials = new UserCredentials();
  public userLoggedOn: boolean = false;
  public userSubmittedToTerms: boolean = false;
  public userReadTerms: boolean = true;
  public userFormValid: boolean = false;

  constructor(router:Router, appService:AppService, authService: AuthService, userService: UserService) {
    this.router = router;
    this.appService = appService;
    this.authService = authService;
    this.userService = userService;

    this.authService.subscribeLogonChanged(this);
  }

  ngOnInit() {
    this.userLoggedOn = false;
    this.createAccountMode = false;
    this.userFormValid = false;
  }

  onLoginChanged(value:UserJWT) {

    if (value) {
      this.userLoggedOn = !value.isDefault();
    }
    else {
      return;
    }

    // Redirect -> Home
    //
    if (this.userLoggedOn && this.router) {
      this.router.navigate(['home']);
    }
  }

  login(){

    // Already Logged On
    if (this.userLoggedOn)
      return;

    // Logon Mode + User Form Valid -> Logon
    //
    if (!this.createAccountMode &&
         this.userFormValid) {
      this.authService.logon(this.userLogon.userName, this.userLogon.password);
    }
  }

  onFormInput(){

    // Create Account
    if (this.createAccountMode) {
      this.userFormValid = !!this.userLogon.userName && !!this.userLogon.password && this.userSubmittedToTerms;
    }

    // Logon
    else {
      this.userFormValid = !!this.userLogon.userName && !!this.userLogon.password;
    }
  }

  onCheckChanged($event: boolean) {

    // Update Value
    this.userSubmittedToTerms = $event;

    // Re-validate form
    this.onFormInput();
  }

  setCreateAccountMode(){

    // Set create account mode
    this.createAccountMode = true;

    // Re-validate form
    this.onFormInput();
  }

  createUser(){

    // Finish Logon
    /*
    this.userService
      .createUser(new User(-1, this.primaryUser.name))    // Emitted value
      .subscribe(response => {

        // Finally, set the new user
        //this.primaryUser.loggedOn = true;
      });
    */
  }

  protected readonly noop = noop;
}
