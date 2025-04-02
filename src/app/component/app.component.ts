import {afterNextRender, Component, HostListener} from '@angular/core';
import {Tab} from '../model/tab.model';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {NewUserDialogComponent} from './new-user-dialog.component';
import {BehaviorSubject, Observable, Observer, Subscriber} from 'rxjs';
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

  // Logon Dialog
  //public userNameInput: string;

  title = 'sm-esports-web';

  tabs = [new Tab('Community Meta', 'main', 0), new Tab('Chat', 'chat', 1), new Tab('Users', 'users', 2)];
  selectedTab: Tab;

  constructor(appService: AppService, userService: UserService) {

    this.appService = appService;
    //this.newUserDialog = new NewUserDialogComponent(userService);
    this.primaryUser = new User(-1, 'Not Logged In');
    this.userService = userService;
    //this.userNameInput = '';

    // Initialize tabs
    this.selectedTab = this.tabs[0];

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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {

    if (!this.appService)
      return;

    // AppService -> Observable / BehaviorSubscriber -> ...
    this.appService.updateClientSize(new Size((event.target as Window).innerWidth, (event.target as Window).innerHeight));
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
