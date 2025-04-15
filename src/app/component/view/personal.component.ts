import {Component} from '@angular/core';
import {UserService} from '../../service/user.service';
import {User} from '../../model/user.model';
import {NgOptimizedImage, NgStyle} from '@angular/common';
import {AppService} from '../../service/app.service';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {ChatBoxComponent} from '../control/chatbox.component';

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
      let userName:string = params['userName'];

      userService.getUser(userName).subscribe(response =>{
        this.person = response.data || undefined;
      });
    });
  }
}
