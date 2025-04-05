import {Component} from '@angular/core';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {NgForOf, NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../service/app.service';

@Component({
  selector: 'people',
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgStyle
  ],
  templateUrl: './template/people.component.html'
})
export class PeopleComponent {

  protected readonly appService: AppService;
  private readonly userService: UserService;

  protected userList: User[];

  constructor(appService:AppService, userService: UserService) {
    this.appService = appService;
    this.userService = userService;
    this.userList = [];
  }

  ngOnInit() {
    this.userService.getAll().subscribe(response => {
      this.userList = response.data || [];
    });
  }
}
