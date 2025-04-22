import {Component, ElementRef, HostListener, Input, TrackByFunction, ViewChild} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {PersonRoleType, User} from '../../../model/repository/entity/user.model';
import {PeopleDataSource} from '../../datasource/people.datasource';
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../../../service/app.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {CdkVirtualScrollViewport, ScrollingModule} from '@angular/cdk/scrolling';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef, CdkFooterCell, CdkFooterCellDef, CdkFooterRow,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef,
  CdkTable
} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';

@Component({
  selector: 'people-search',
  imports: [
    NgForOf,
    NgStyle,
    FormsModule,
    FaIconComponent,
    ScrollingModule,
    CdkTable,
    CdkColumnDef,
    CdkHeaderCell,
    CdkHeaderCellDef,
    CdkCellDef,
    CdkCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
    CdkFooterRow,
    CdkFooterCell,
    CdkFooterCellDef
  ],
  templateUrl: '../../template/view/people/people-search.component.html'
})
export class PeopleSearchComponent {

  protected readonly peopleDataSource:PeopleDataSource;

  protected readonly faCircle = faCircle;
  protected readonly PersonRoleType = PersonRoleType;

  protected selectedField:string = '';
  protected people: User[] = [];

  constructor(protected readonly appService:AppService,
              protected readonly userService: UserService,
              protected readonly router: Router) {

    this.peopleDataSource = new PeopleDataSource(this.userService);
    //this.userService.resetSearch();

    // Set a watch on the user name
    userService.onFilterChange().subscribe(() => {
      //this.reload();
    });

    // Filtering is set up as a public member of UserService
    this.reload();
  }

  trackByPeopleId(index:number, user:User) {
    return index;
  }

  reload() {
    this.userService.getAll()
      .then(users => {

      });
  }
  loadPage(page:number) {

  }
}
