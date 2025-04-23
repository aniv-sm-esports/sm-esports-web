import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {PersonRoleType, User} from '../../../model/repository/entity/user.model';
import {NgClass, NgForOf, NgStyle, SlicePipe} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router} from '@angular/router';
import {AvatarComponent, AvatarSize} from '../../control/avatar.component';
import {PageData, PageInfo} from '../../../model/service/page.model';
import {SearchModel} from '../../../model/repository/search.model';
import {ApiResponseType} from '../../../model/service/app.model';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {UserSearchPipe} from '../../../pipe/user-search.pipe';
import {SlicePipeTyped} from '../../../pipe/slice-typed.pipe';
import {EntityDataSource} from '../../datasource/entity.datasource';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, ScrollingModule} from '@angular/cdk/scrolling';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'people-all',
  imports: [
    NgForOf,
    AvatarComponent,
    FaIconComponent,
    UserSearchPipe,
    SlicePipe,
    SlicePipeTyped,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    ScrollingModule,
    NgStyle,
    NgClass
  ],
  templateUrl: '../../template/view/people/people-all.component.html'
})
export class PeopleAllComponent {

  protected peopleDataSource:User[] = [];

  protected readonly faCircle = faCircle;
  protected readonly AvatarSize = AvatarSize;
  protected readonly PersonRoleType = PersonRoleType;

  protected peopleBoardSearch:SearchModel<User>;
  protected peopleGeneralSearch:SearchModel<User>;

  constructor(protected readonly appService:AppService,
              protected readonly userService:UserService,
              protected readonly router: Router) {

    this.peopleBoardSearch = new SearchModel<User>({ "personRole": PersonRoleType.BoardMember } as User, ["personRole"]);
    this.peopleGeneralSearch = new SearchModel<User>({ "personRole": PersonRoleType.GeneralUser } as User, ["personRole"]);

    //this.userService.resetSearch();

    // Set a watch on the user name
    userService.onFilterChange().subscribe(() => {
      this.reload();
    });

    this.reload();
  }

  reload() {
    this.userService.get(PageInfo.first(50))
        .then(users => {
          this.peopleDataSource = users;
        });
  }
}
