import {Component} from '@angular/core';
import {UserService} from '../../service/user.service';
import {NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../../service/app.service';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {ChatBoxComponent} from '../control/chatbox.component';
import {User} from '../../../server/entity/model/User';

@Component({
  selector: 'personal',
  imports: [
    NgOptimizedImage,
    NgStyle,
    RouterLink,
    RouterLinkActive,
    ChatBoxComponent
  ],
  templateUrl: '../template/view/personal.component.html'
})
export class PersonalComponent {

  // DOM Usage
  protected appService: AppService;
  protected person:User | undefined;

  constructor(appService:AppService, userService: UserService, activatedRoute: ActivatedRoute) {

    this.appService = appService;

    activatedRoute.params.subscribe(params => {

      userService.getBy(user => user.Name === params['userName']).then(users => {
        this.person = users.find(user => user.Name === params['userName']);
      });
    });
  }
}
