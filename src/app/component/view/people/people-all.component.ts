import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {User} from '../../../model/repository/user.model';
import {NgForOf} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router} from '@angular/router';
import {AvatarComponent, AvatarSize} from '../../control/avatar.component';
import {PageData} from '../../../model/service/page.model';
import {SearchModel} from '../../../model/service/search.model';
import {ApiResponseType} from '../../../model/service/app.model';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'people-all',
  imports: [
    NgForOf,
    AvatarComponent,
    FaIconComponent
  ],
  templateUrl: '../../template/view/people/people-all.component.html'
})
export class PeopleAllComponent {

  protected readonly appService: AppService;
  private readonly userService: UserService;
  private readonly router: Router;

  protected peopleBoard: User[] = [];
  protected peopleGeneral: User[] = [];

  protected readonly faCircle = faCircle;

  protected readonly AvatarSize = AvatarSize;
  protected pageSize:number = 25;

  constructor(appService:AppService, userService: UserService, router: Router) {
    this.appService = appService;
    this.userService = userService;
    this.router = router;
  }

  ngOnInit() {
    let searchBoard: SearchModel<User> = new SearchModel<User>();
    let searchGeneral: SearchModel<User> = new SearchModel<User>();

    searchBoard.set('personRole', 'Board Member');

    // Fetch Board (this will need tuning later) (have to do pre-queries for the paging)
    this.userService.getPage(PageData.fromRequest(1, this.pageSize), searchBoard).subscribe(response => {

      if (response.response == ApiResponseType.Success) {
        this.peopleBoard = response.apiData.dataSet || [];
      }
    });

    searchGeneral.set('personRole', 'General User');

    this.userService.getPage(PageData.fromRequest(1, this.pageSize), searchGeneral).subscribe(response => {
      this.peopleGeneral = response.apiData.dataSet || [];
    });
  }
}
