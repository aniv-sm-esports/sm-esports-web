import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {User} from '../../../model/repository/user.model';
import {NgForOf, NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {PageData} from '../../../model/service/page.model';
import {SearchModel} from '../../../model/service/search.model';
import {ApiResponseType} from '../../../model/service/app.model';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {BasicCheckboxComponent} from '../../control/primitive/sm-esports-select';
import {BasicButtonComponent} from '../../control/primitive/button.component';

@Component({
  selector: 'people-search',
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgStyle,
    RouterLink,
    NgSelectComponent,
    FormsModule,
    BasicCheckboxComponent,
    BasicButtonComponent
  ],
  templateUrl: '../../template/view/people/people-search.component.html'
})
export class PeopleSearchComponent {

  protected readonly appService: AppService;
  private readonly userService: UserService;

  protected userList: User[];

  protected searchType:string = '';
  protected searchValue:string = '';
  protected searchFields:string[] = [
    'name',
    'email',
    'personRole'
  ];
  protected selectedField:string = '';

  constructor(appService:AppService, userService: UserService, router: Router) {
    this.appService = appService;
    this.userService = userService;
    this.userList = [];
  }

  ngOnInit() {
    this.search("");
  }

  search(searchInput: string) {

    let search: SearchModel<User> = new SearchModel<User>();

    search.set('name', searchInput);

    // Fetch Board (this will need tuning later) (have to do pre-queries for the paging)
    this.userService.getPage(PageData.fromRequest(1, 25), search).subscribe(response => {

      if (response.response == ApiResponseType.Success) {
        this.userList = response.apiData.dataSet || [];
      }
    });
  }
}
