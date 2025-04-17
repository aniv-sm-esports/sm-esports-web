import {Component} from '@angular/core';
import {UserJWT} from '../model/service/user-logon.model';
import {AuthService} from '../service/auth.service';
import {UserService} from '../service/user.service';
import {FormsModule} from '@angular/forms';
import {BasicButtonComponent} from './control/primitive/button.component';
import {BasicCheckboxComponent} from './control/primitive/checkbox.component';
import {NgIf, NgStyle} from '@angular/common';
import {AppService} from '../service/app.service';
import {Router} from '@angular/router';
import {noop} from 'rxjs';
import {AuthHandler} from '../model/service/handler.model';
import {UserCreation} from '../model/view/user-creation.model';
import {ApiResponseType} from '../model/service/app.model';
import {NotifyComponent} from './control/notify.component';
import {NotifySeverity, NotifyType} from '../model/service/notify.model';

@Component({
  selector: 'create-account',
  imports: [
    FormsModule,
    BasicButtonComponent,
    BasicCheckboxComponent,
    NgStyle,
    NgIf,
    NotifyComponent
  ],
  templateUrl: './template/create-account.component.html'
})
export class CreateAccountComponent implements AuthHandler {

  protected readonly appService: AppService;
  private readonly authService: AuthService;
  private readonly userService: UserService;
  private readonly router: Router;

  protected readonly noop = noop;

  public userCreation:UserCreation;
  public userSubmittedToTerms: boolean = false;
  public userReadTerms: boolean = true;
  public userFormValid: boolean = false;
  public userCreationGeneralError: boolean = false;
  public userCreationGeneralErrorMessage:string = '';

  constructor(router:Router, appService:AppService, authService: AuthService, userService: UserService) {
    this.router = router;
    this.appService = appService;
    this.authService = authService;
    this.userService = userService;

    this.userCreation = new UserCreation();

    this.authService.subscribeLogonChanged(this);
  }

  ngOnInit() {
    this.userSubmittedToTerms = false;
    this.userFormValid = false;
    this.userReadTerms = false;
  }

  onLoginChanged(value:UserJWT) {

    // Redirect -> Home
    //
    if (!value.isDefault() && this.router) {
      this.router.navigate(['home/live']);
    }
  }

  onFormInput(){
    this.userFormValid =
      !!this.userCreation.userName &&
      !!this.userCreation.password &&
      !!this.userCreation.email &&
      this.userSubmittedToTerms;
  }

  onCheckChanged($event: boolean) {

    // Update Value
    this.userSubmittedToTerms = $event;

    // Re-validate form
    this.onFormInput();
  }

  createAccount(){

    if (!this.userFormValid) {
      return;
    }

    this.userService
      .createUser(this.userCreation)    // Emitted value
      .subscribe(response => {

        this.userCreation.update(response);

        // Success
        if (response.passwordInvalid ||
            response.emailInvalid ||
            response.userNameInvalid){
          this.userCreationGeneralError = false;
          this.userCreationGeneralErrorMessage = '';

          this.authService.logon(response.userName, response.password);
        }
        else {
          this.userCreationGeneralError = !response.userNameInvalid && !response.passwordInvalid && !response.emailInvalid;
          this.userCreationGeneralErrorMessage = 'General Error: Please contact admin';
        }
      });
  }

  protected readonly NotifyType = NotifyType;
  protected readonly NotifySeverity = NotifySeverity;
}
