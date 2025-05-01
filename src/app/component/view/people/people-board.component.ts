import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {AvatarComponent, AvatarSize} from '../../control/avatar.component';
import {UserSearchPipe} from '../../../pipe/user-search.pipe';
import {User} from '../../../../server/entity/model/User';
import {PersonRoleTypeEnum} from '../../../../server/entity/model/PersonRoleType';

@Component({
  selector: 'people-board',
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgStyle,
    RouterLink,
    NgIf,
    AvatarComponent,
    UserSearchPipe
  ],
  templateUrl: '../../template/view/people/people-board.component.html'
})
export class PeopleBoardComponent {

  protected readonly appService: AppService;
  private readonly userService: UserService;
  private readonly router: Router;
  protected readonly AvatarSize = AvatarSize;
  protected people: User[] = [];

  constructor(appService:AppService, userService: UserService, router: Router) {
    this.appService = appService;
    this.userService = userService;
    this.router = router;

    //this.userService.resetSearch();
    //this.userService.updateSearch("personRole", PersonRoleType.BoardMember );

    // Set a watch on the user name
    userService.onFilterChange().subscribe(() => {
      this.reload();
    });

    // Filtering is set up as a public member of UserService
    this.reload();
  }

  reload() {
    this.userService.getBy(user => user.PersonRoleId === PersonRoleTypeEnum.BoardMember)
      .then(users => {
        this.people = users;
      });
  }
  loadPage(page:number) {

  }
}
