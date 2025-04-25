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

  @Output('formFinished') formFinished: EventEmitter<any> = new EventEmitter();

  protected readonly appService: AppService;
  private readonly authService: AuthService;
  private readonly userService: UserService;
  private readonly router: Router;

  protected readonly noop = noop;

  public userLogon:UserCredentials = new UserCredentials();
  public userLoggedOn: boolean = false;
  public userFormValid: boolean = false;

  constructor(router:Router, appService:AppService, authService: AuthService, userService: UserService) {
    this.router = router;
    this.appService = appService;
    this.authService = authService;
    this.userService = userService;

    this.authService.subscribeLogonChanged(this);

    router.events.subscribe((event) => {
      // Notify Listener(s)
      this.formFinished.emit(true);
    });
  }

  ngOnInit() {
    this.userLoggedOn = false;
    this.userFormValid = false;
  }

  onLoginChanged(value:UserJWT) {

    if (value) {
      this.userLoggedOn = !value.isDefault();

      // Notify Listener(s)
      this.formFinished.emit(true);
    }
    else {
      return;
    }

    // Redirect -> Home
    //
    if (this.userLoggedOn && this.router) {
      //this.router.navigate(['home/live']);
    }
  }

  login(){

    // Already Logged On
    if (this.userLoggedOn)
      return;

    // Logon Mode + User Form Valid -> Logon
    //
    if (this.userFormValid) {

      // Call Auth Service
      this.authService.logon(this.userLogon.userName, this.userLogon.password);
    }
  }

  onFormInput(){
      this.userFormValid = !!this.userLogon.userName && !!this.userLogon.password;
  }
}
