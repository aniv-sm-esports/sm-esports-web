import {afterNextRender, Component, HostListener} from '@angular/core';
import {Tab} from '../model/tab.model';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {NewUserDialogComponent} from './new-user-dialog.component';
import {Size} from '../model/app.model';
import {NewsComponent} from './news.component';
import {AppService} from '../service/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './template/app.component.html',
  standalone: false
})
export class AppComponent {

  private readonly appService: AppService;
  //private readonly modalService: ModalService;
  private readonly userService: UserService;
  //private readonly newUserDialog: NewUserDialogComponent;

  // PRIMARY USER MODEL:  This should store user's data (could be relocated to user service.. which
  //                      would then be the "user's service"
  public primaryUser: User;

  // The size of the body will be dynamically set during resize / load events
  //
  public clientSize: Size;
  public bodySize: Size;
  public bodyMargin: number = 20;
  public bannerHeightSmall: number = 48.6;
  public bannerHeightLarge: number = 68;
  public bannerHeight: number = this.bannerHeightSmall;     // Responsive setting
  public mediaLarge: number = 1400;

  // Logon Dialog
  //public userNameInput: string;

  title = 'sm-esports-web';

  constructor(appService: AppService, userService: UserService) {

    this.appService = appService;
    //this.newUserDialog = new NewUserDialogComponent(userService);
    this.primaryUser = new User(-1, 'Not Logged In');
    this.userService = userService;
    this.clientSize = new Size(0,0);
    this.bodySize = new Size(0,0);
    //this.userNameInput = '';

    // TODO: Find a way to prevent the dialog from destroying its data!
    //this.newUserDialog.userValue.subscribe( userName => {
    //  this.userNameInput = userName;
    //});

    /*
    // TODO: Look for active route <-> tab
    for (let tab of this.tabs){
      if (tab.route == activeRoute.toString())
        this.selectedTab = tab;
    }
    */

    // IMPORTANT: Defer this until after SSR completes
    /*
    afterNextRender(() => {

      // Show Dialog -> Create User
      this.newUserDialog
        .showDialog()
        .beforeClosed()
        .subscribe(() => {

          console.log(this.newUserDialog.userInput);


      });
    });
    */
  }

  @HostListener('window:load', ['$event'])
  onLoad(event: Event) {
    if (!this.appService || !event || !event.currentTarget)
      return;

    // Window + Body Size (NOTE: event.target != event.currentTarget)
    //
    this.clientSize.width = (event.currentTarget as Window).innerWidth;
    this.clientSize.height = (event.currentTarget as Window).innerHeight;

    // Responsive Banner Height
    //
    if (this.clientSize.width > this.mediaLarge)
      this.bannerHeight = this.bannerHeightLarge;
    else
      this.bannerHeight = this.bannerHeightSmall;

    // AppService -> Observable / BehaviorSubscriber -> ...
    this.appService.updateClientSize(this.clientSize);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!this.appService || !event || !event.currentTarget)
      return;

    // Window + Body Size (NOTE: event.target != event.currentTarget)
    //
    this.clientSize.width = (event.target as Window).innerWidth;
    this.clientSize.height = (event.target as Window).innerHeight;

    // Responsive Banner Height
    //
    if (this.clientSize.width > this.mediaLarge)
      this.bannerHeight = this.bannerHeightLarge;
    else
      this.bannerHeight = this.bannerHeightSmall;

    // AppService -> Observable / BehaviorSubscriber -> ...
    this.appService.updateClientSize(this.clientSize);
  }

  logOn(){

    // Finish Logon
    this.userService
      .createUser(new User(-1, this.primaryUser.name))    // Emitted value
      .subscribe(response => {

        // Finally, set the new user
        this.primaryUser.loggedOn = true;
      });

  }
}
