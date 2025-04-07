import {Component} from '@angular/core';
import {UserLogon} from '../model/user-logon.model';
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
export class LoginComponent {

  protected readonly appService: AppService;
  private readonly authService: AuthService;
  private readonly userService: UserService;

  public createAccountMode:boolean = false;

  public userLogon:UserLogon = new UserLogon();
  public userLoggedOn: boolean = false;
  public userSubmittedToTerms: boolean = false;
  public userReadTerms: boolean = true;
  public userFormValid: boolean = false;

  constructor(appService:AppService, authService: AuthService, userService: UserService) {
    this.appService = appService;
    this.authService = authService;
    this.userService = userService;

    this.authService.subscribeLogonChanged(() =>{
      this.userLoggedOn = this.authService.isLoggedIn();
    });
  }

  ngOnInit() {
    this.createAccountMode = false;
    this.userFormValid = false;
  }

  login(){

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
}
