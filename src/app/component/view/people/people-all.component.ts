import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {NgClass, NgForOf, NgStyle, SlicePipe} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router} from '@angular/router';
import {AvatarComponent, AvatarSize} from '../../control/avatar.component';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {UserSearchPipe} from '../../../pipe/user-search.pipe';
import {SlicePipeTyped} from '../../../pipe/slice-typed.pipe';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, ScrollingModule} from '@angular/cdk/scrolling';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {User} from '../../../../server/entity/model/User';
import {EntityCacheSearch} from '../../../../server/entity/entity-cache-search';
import {PageData} from '../../../../server/model/page-data.model';
import {PersonRoleType, PersonRoleTypeEnum} from '../../../../server/entity/model/PersonRoleType';

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
  protected readonly PersonRoleTypeEnum = PersonRoleTypeEnum;

  protected peopleBoardSearch:EntityCacheSearch<User>;
  protected peopleGeneralSearch:EntityCacheSearch<User>;

  constructor(protected readonly appService:AppService,
              protected readonly userService:UserService,
              protected readonly router: Router) {

    this.peopleBoardSearch = new EntityCacheSearch<User>({ "PersonRoleId": PersonRoleTypeEnum.BoardMember } as User, ["PersonRoleId"]);
    this.peopleGeneralSearch = new EntityCacheSearch<User>({ "PersonRoleId": PersonRoleTypeEnum.GeneralUser } as User, ["PersonRoleId"]);

    //this.userService.resetSearch();

    // Set a watch on the user name
    userService.onFilterChange().subscribe(() => {
      this.reload();
    });

    this.reload();
  }

  reload() {
    this.userService.get(new PageData(1, 50))
        .then(users => {
          this.peopleDataSource = users;
        });
  }
}
