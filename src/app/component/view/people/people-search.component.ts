import {Component, ElementRef, HostListener, Input, TrackByFunction, ViewChild} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {PersonRoleType, User} from '../../../model/repository/entity/user.model';
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {CdkVirtualScrollViewport, ScrollingModule} from '@angular/cdk/scrolling';
import {PeopleTableSearchComponent} from './people-table-search.component';

@Component({
  selector: 'people-search',
  imports: [
    NgForOf,
    NgStyle,
    FormsModule,
    FaIconComponent,
    ScrollingModule,
    PeopleTableSearchComponent
  ],
  templateUrl: '../../template/view/people/people-search.component.html'
})
export class PeopleSearchComponent {

  protected readonly faCircle = faCircle;
  protected readonly PersonRoleType = PersonRoleType;

  protected selectedField:string = '';
  protected people: User[] = [];

  constructor(protected readonly appService:AppService,
              protected readonly userService: UserService,
              protected readonly router: Router) {

  }
}
