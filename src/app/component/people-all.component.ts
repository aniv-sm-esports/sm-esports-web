import {Component} from '@angular/core';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {AvatarComponent, AvatarSize} from './control/avatar.component';
import {PageData} from '../model/page.model';

@Component({
  selector: 'people-all',
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgStyle,
    RouterLink,
    NgIf,
    AvatarComponent
  ],
  templateUrl: './template/people-all.component.html'
})
export class PeopleAllComponent {

  protected readonly appService: AppService;
  private readonly userService: UserService;
  private readonly router: Router;

  protected userList: User[];

  constructor(appService:AppService, userService: UserService, router: Router) {
    this.appService = appService;
    this.userService = userService;
    this.router = router;
    this.userList = [];
  }

  ngOnInit() {
    this.userService.getPage(PageData.fromRequest(1, 25)).subscribe(response => {
      this.userList = response.data || [];
    });
  }

  protected readonly AvatarSize = AvatarSize;
}
