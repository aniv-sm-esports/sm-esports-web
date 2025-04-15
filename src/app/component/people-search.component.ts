import {Component} from '@angular/core';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {NgForOf, NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {PageData} from '../model/page.model';

@Component({
  selector: 'people-search',
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgStyle,
    RouterLink
  ],
  templateUrl: './template/people-search.component.html'
})
export class PeopleSearchComponent {

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
}
