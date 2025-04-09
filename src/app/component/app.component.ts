import {afterNextRender, Component, HostListener} from '@angular/core';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {ApiResponseType, Size} from '../model/app.model';
import {AppService} from '../service/app.service';
import {AuthService} from '../service/auth.service';
import {UserJWT} from '../model/user-logon.model';
import {AuthHandler} from '../model/handler.model';
import moment from 'moment';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './template/app.component.html',
  standalone: false
})
export class AppComponent implements AuthHandler {

  protected readonly appService: AppService;
  private readonly userService: UserService;

  // Font Awesome
  public faBars = faBars;

  // PRIMARY USER MODEL:  This should store user's data (could be relocated to user service.. which
  //                      would then be the "user's service"
  public primaryUserLogon: UserJWT;
  public primaryUserLoggedOn: boolean;

  // The size of the body will be dynamically set during resize / load events
  //
  public showSideNavRight: boolean = false;
  public showSideNavLeft: boolean = false;
  public showChatNavTree: boolean = false;

  // Logon Dialog
  //public userNameInput: string;

  title = 'sm-esports-web';

  constructor(appService: AppService, userService: UserService, authService: AuthService) {

    this.appService = appService;
    this.primaryUserLogon = UserJWT.default();
    this.primaryUserLoggedOn = false;
    this.userService = userService;

    // User Logon Listener
    //
    authService.subscribeLogonChanged(this);
    authService.refreshSession();
  }

  onLoginChanged(value: UserJWT){

    if (!value) {
      this.primaryUserLogon = UserJWT.default();
      this.primaryUserLoggedOn = false;
    }

    else {
      this.primaryUserLogon = value;
      this.primaryUserLoggedOn = !value.isDefault();
    }
  }

  ngOnInit() {
    this.primaryUserLoggedOn = false;
  }

  @HostListener('window:load', ['$event'])
  onLoad(event: Event) {
    if (!this.appService || !event || !event.currentTarget)
      return;

    // Window + Body Size (NOTE: event.target != event.currentTarget)
    //
    // AppService -> Observable / BehaviorSubscriber -> ...
    this.appService.updateClientSize(new Size((event.currentTarget as Window).innerWidth, (event.currentTarget as Window).innerHeight));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!this.appService || !event || !event.currentTarget)
      return;

    // Window + Body Size (NOTE: event.target != event.currentTarget)
    //
    // AppService -> Observable / BehaviorSubscriber -> ...
    this.appService.updateClientSize(new Size((event.target as Window).innerWidth, (event.target as Window).innerHeight));
  }

  onSideNavOffClick(event: Event) {
    this.showSideNavLeft = false;
    this.showSideNavRight = false;
  }

  protected readonly moment = moment;
}
