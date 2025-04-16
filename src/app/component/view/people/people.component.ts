import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {User} from '../../../model/repository/user.model';
import {AppService} from '../../../service/app.service';
import {Router, RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'people',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: '../../template/view/people/people.component.html'
})
export class PeopleComponent {

  protected readonly appService: AppService;
  private readonly userService: UserService;
  private readonly router: Router;

  protected userList: User[];

  constructor(appService:AppService, userService: UserService, router: Router) {
    this.appService = appService;
    this.userService = userService;
    this.router = router;
    this.userList = [];

    router.navigate(['people/all']);
  }

  ngOnInit() {
  }
}
