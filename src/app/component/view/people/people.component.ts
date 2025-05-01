import {Component, ElementRef, QueryList, viewChild, ViewChild, ViewChildren} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {AppService} from '../../../service/app.service';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf, NgStyle} from '@angular/common';
import {PagerComponent} from '../../control/primitive/pager.component';
import {PageData} from '../../../../server/model/page-data.model';

@Component({
  selector: 'people',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgStyle,
    PagerComponent
  ],
  templateUrl: '../../template/view/people/people.component.html'
})
export class PeopleComponent {

  @ViewChild("peopleContainer") peopleContainer!: ElementRef;

  protected readonly appService: AppService;
  private readonly userService: UserService;
  private readonly router: Router;
  private readonly activeRoute: ActivatedRoute;

  protected searchVisible:boolean = true;
  protected searchType:string = '';
  protected searchValue:string = '';
  protected searchFields:string[] = [
    'name',
    'email',
    'personRole'
  ];

  public pageNumber:number = 1;
  public pageSize:number = 50;

  constructor(appService:AppService, userService: UserService, router: Router, activatedRoute: ActivatedRoute) {

    this.appService = appService;
    this.userService = userService;
    this.router = router;
    this.activeRoute = activatedRoute;

    // Simple DOM locator... Maybe try some inheritance pattern (?)
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('all')) {
          this.searchVisible = true;
        }
        else if (event.url.includes('board')) {
          this.searchVisible = false;
        }
        else if (event.url.includes('search')) {
          this.searchVisible = true;
        }
      }
    });

  }

  ngOnInit(){

  }

  onPageChanged(pageNumber:number) {
    this.userService.get(new PageData(this.pageNumber, this.pageSize));
  }

  getContainerHeight() {

    if (this.searchVisible) {
      return '0';
    }
    else {
      return this.peopleContainer?.nativeElement?.style?.top || '0';
    }
  }

  search(searchInput: string) {

    // Set -> Observers -> Get ...
    //
    //this.userService.updateSearch("name", searchInput);
  }
}
