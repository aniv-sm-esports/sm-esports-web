import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {PersonRoleType, User} from '../../../model/repository/user.model';
import {NgForOf} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router} from '@angular/router';
import {AvatarComponent, AvatarSize} from '../../control/avatar.component';
import {PageData} from '../../../model/service/page.model';
import {SearchModel} from '../../../model/service/search.model';
import {ApiResponseType} from '../../../model/service/app.model';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {UserSearchPipe} from '../../../pipe/user-search.pipe';

@Component({
  selector: 'people-all',
  imports: [
    NgForOf,
    AvatarComponent,
    FaIconComponent,
    UserSearchPipe
  ],
  templateUrl: '../../template/view/people/people-all.component.html'
})
export class PeopleAllComponent {

  protected readonly appService: AppService;
  protected userService: UserService;
  private readonly router: Router;

  protected readonly faCircle = faCircle;

  protected readonly AvatarSize = AvatarSize;
  protected pageSize:number = 30;

  // "Injected" Data
  //
  protected people:User[] = [];
  protected peopleBoardSearch:SearchModel<User>;
  protected peopleGeneralSearch:SearchModel<User>;

  constructor(appService:AppService, router: Router, userService:UserService) {
    this.appService = appService;
    this.userService = userService;
    this.router = router;
    this.peopleBoardSearch = SearchModel.fromMap({ "personRole": PersonRoleType.BoardMember });
    this.peopleGeneralSearch = SearchModel.fromMap({ "personRole": PersonRoleType.GeneralUser });

    // Reset the user search
    userService.resetSearch();

    // Set a watch on the user name
    userService.onSearchChanged().subscribe(() => {
      this.reload();
    });

    // Filtering is set up as a public member of UserService
    this.reload();
  }

  reload() {
    this.userService.getUserPage(PageData.firstPage(50))
        .then(users => {
          this.people = users;
        });
  }
  loadPage(page:number) {

  }
}
