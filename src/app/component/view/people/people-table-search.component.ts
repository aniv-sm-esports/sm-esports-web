import {Component, Input, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {AppService} from '../../../service/app.service';
import {CommonModule, NgForOf, NgTemplateOutlet} from '@angular/common';
import { PageInfo } from '../../../model/service/page.model';
import {PersonRoleType, User} from '../../../model/repository/entity/user.model';
import {UserService} from '../../../service/user.service';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'people-table-search',
  imports: [
    NgForOf,
    NgTemplateOutlet,
    CommonModule,
    FaIconComponent
  ],
  templateUrl: '../../template/view/people/people-table-search.component.html',
})
export class PeopleTableSearchComponent {

  protected dataSource:Array<User>;

  protected readonly faCircle = faCircle;
  protected readonly PersonRoleType = PersonRoleType;

  constructor(protected readonly appService:AppService,
              protected readonly userService: UserService) {

    this.dataSource = new Array<User>();

    this.userService.onEntitiesChanged().subscribe(response => {
      this.dataSource = response.data;
    });
  }
}
