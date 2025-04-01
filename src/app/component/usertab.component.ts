import {
  Component, ComponentRef, computed,
  ContentChild,
  contentChild, ContentChildren,
  ElementRef,
  forwardRef,
  Signal,
  ViewChild,
  viewChild, ViewChildren
} from '@angular/core';
import {GetUsersResponse, IGetUsersResponse, IUser, IUserResponse} from '../model/user.model';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {InputWithHintsComponent} from './input-with-hints';
import {BasicButtonComponent} from './basic-button';
import {FormsModule} from '@angular/forms';
import {UserListComponent} from './userlist.component';

@Component({
  selector: 'usertab',
  imports: [
    InputWithHintsComponent,
    BasicButtonComponent,
    FormsModule,
    UserListComponent
  ],
  templateUrl: './template/usertab.component.html'
})
export class UserTabComponent {

  private readonly userService: UserService;
  public userList: IUser[];
  public userInput: string;

  /*
  //@ts-ignore
  protected userInput: InputWithHintsComponent;
  //@ts-ignore
  protected buttons: BasicButtonComponent[];

  @ViewChild('input-hints')
  set setUserInput (input: InputWithHintsComponent){
    setTimeout(() =>
    {
      this.userInput = input;
    });
  }

  @ViewChildren('basic-button')
  set setButtons (buttons: BasicButtonComponent[]) {
    setTimeout(() =>
    {
      this.buttons = buttons;

      this.buttons[0].text = 'Create User';
      this.buttons[1].text = 'Get All Users';
    });
  }
  */

  constructor(theService: UserService) {

    this.userInput = '';
    this.userService = theService;
    this.userList = [new User(-1, 'Not Logged In')];

    /*
    // Initialize -> getAllUsers
    userService.getAllUsers().forEach(value => {
        return value.users;
    }).then(newUsers => {
      for (let user: IUser in newUsers) {
        this.users.push(new User(user.id, user.name) as IUser);
      }
    });
    */
  }

  addUser() {

    if (!this.userInput)
      console.log('Must enter a user name!');

    else
    {
      console.log('Adding user ' + this.userInput);

      this.userService
          .createUser(new User(-1, ''))
          .subscribe(() =>
      {
        // Reset user array
        this.userService
            .getAllUsers()
            .forEach((userResponse) => {

              console.log("updating user list");

              // Clear
              this.userList = [];

              // Apply user response
              userResponse.users.forEach((user) => {
                this.userList.push(user);
              })
        }).finally(() =>
        {
          console.log('Users updated');
        });

      });
    }

  }

  getUsers() {
    console.log('Getting users');

    this.userService.getAllUsers().subscribe((value: GetUsersResponse) => {
      console.log(value);
    });
  }

  // TODO: Angular 19 version of $event was the forwarded data. DOM is off limits >_<
  onUserNameChanged($event: string) {
    this.userInput = $event;
  }
}
