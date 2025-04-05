import {afterNextRender, Component, HostListener} from '@angular/core';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {Size} from '../model/app.model';
import {AppService} from '../service/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './template/app.component.html',
  standalone: false
})
export class AppComponent {

  protected readonly appService: AppService;
  private readonly userService: UserService;

  // PRIMARY USER MODEL:  This should store user's data (could be relocated to user service.. which
  //                      would then be the "user's service"
  public primaryUser: User;

  // The size of the body will be dynamically set during resize / load events
  //
  public showSideNav: boolean = false;
  public showChatNavTree: boolean = false;

  // Logon Dialog
  //public userNameInput: string;

  title = 'sm-esports-web';

  constructor(appService: AppService, userService: UserService) {

    this.appService = appService;
    this.primaryUser = new User(-1, 'Not Logged In');
    this.userService = userService;

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
    this.showSideNav = false;
  }

  logOn(){

    // Finish Logon
    this.userService
      .createUser(new User(-1, this.primaryUser.name))    // Emitted value
      .subscribe(response => {

        // Finally, set the new user
        //this.primaryUser.loggedOn = true;
      });

  }
}
