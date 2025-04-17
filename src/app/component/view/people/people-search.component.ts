import {Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {PersonRoleType, User} from '../../../model/repository/user.model';
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {BasicCheckboxComponent} from '../../control/primitive/sm-esports-select';
import {BasicButtonComponent} from '../../control/primitive/button.component';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {PageData} from '../../../model/service/page.model';
import {SearchModel} from '../../../model/service/search.model';

@Component({
  selector: 'people-search',
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgStyle,
    RouterLink,
    NgSelectComponent,
    FormsModule,
    FaIconComponent,
    BasicCheckboxComponent,
    BasicButtonComponent,
    NgIf
  ],
  templateUrl: '../../template/view/people/people-search.component.html'
})
export class PeopleSearchComponent {

  protected readonly appService: AppService;
  private readonly userService: UserService;

  protected readonly faCircle = faCircle;
  protected readonly PersonRoleType = PersonRoleType;

  protected selectedField:string = '';
  protected people: User[] = [];

  constructor(appService:AppService, userService: UserService, router: Router) {
    this.appService = appService;
    this.userService = userService;

    this.userService.resetSearch();

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
