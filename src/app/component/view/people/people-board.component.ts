import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {User} from '../../../model/user.model';
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {AvatarComponent, AvatarSize} from '../../control/avatar.component';
import {PageData} from '../../../model/page.model';
import {SearchModel} from '../../../model/search.model';
import {ApiResponseType} from '../../../model/app.model';

@Component({
  selector: 'people-board',
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgStyle,
    RouterLink,
    NgIf,
    AvatarComponent
  ],
  templateUrl: '../../template/view/people/people-board.component.html'
})
export class PeopleBoardComponent {

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
    let searchBoard: SearchModel<User> = new SearchModel<User>();

    searchBoard.set('personRole', 'Board Member');

    // Fetch Board (this will need tuning later) (have to do pre-queries for the paging)
    this.userService.getPage(PageData.fromRequest(1, 25), searchBoard).subscribe(response => {

      if (response.response == ApiResponseType.Success) {
        this.userList = response.data || [];
      }
    });
  }

  protected readonly AvatarSize = AvatarSize;
}
