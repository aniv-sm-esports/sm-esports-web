import {Component} from '@angular/core';
import {AuthService} from '../../../service/auth.service';
import {FormsModule} from '@angular/forms';
import {BasicButtonComponent} from '../../control/primitive/button.component';
import {BasicCheckboxComponent} from '../../control/primitive/checkbox.component';
import {NgIf, NgStyle} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router} from '@angular/router';
import {noop} from 'rxjs';
import {AuthHandler} from '../../../model/service/handler.model';
import {UserCreation} from '../../../model/view/user-creation.model';
import {NotifyComponent} from '../../control/notify.component';
import {NotifySeverity, NotifyType} from '../../../model/service/notify.model';
import {UserJWT} from '../../../../server/entity/model/UserJWT';

@Component({
  selector: 'create-account',
  imports: [
    FormsModule,
    BasicButtonComponent,
    BasicCheckboxComponent,
    NgIf,
    NotifyComponent,
    NgStyle
  ],
  templateUrl: '../../template/view/account/create-account.component.html'
})
export class CreateAccountComponent implements AuthHandler {

  protected readonly NotifyType = NotifyType;
  protected readonly NotifySeverity = NotifySeverity;
  protected readonly noop = noop;

  public userCreation:UserCreation;
  public userSubmittedToTerms: boolean = false;
  public userReadTerms: boolean = true;
  public userFormValid: boolean = false;
  public userCreationGeneralError: boolean = false;
  public userCreationGeneralErrorMessage:string = '';

  constructor(private readonly router:Router,
              protected readonly appService:AppService,
              private readonly authService: AuthService) {

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
      //this.router.navigate(['home/live']);
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

    this.authService
      .createUser(this.userCreation)    // Emitted value
      .subscribe(response => {

        let creation = response.responseData.data[0] as UserCreation;

        this.userCreation.update(creation);

        // Success
        if (creation.passwordInvalid ||
          creation.emailInvalid ||
          creation.userNameInvalid){
          this.userCreationGeneralError = false;
          this.userCreationGeneralErrorMessage = '';

          this.authService.logon(creation.userName, creation.password);
        }
        else {
          this.userCreationGeneralError = !creation.userNameInvalid && !creation.passwordInvalid && !creation.emailInvalid;
          this.userCreationGeneralErrorMessage = 'General Error: Please contact admin';
        }
      });
  }
}
