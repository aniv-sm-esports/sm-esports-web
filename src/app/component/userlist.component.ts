import {Component, Input} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {IUser} from '../model/user.model';

@Component({
  selector: 'user-list',
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: `./template/userlist.component.html`
})
export class UserListComponent {
  @Input() public users: IUser[];

  constructor() {
    this.users = [];
  }
}
