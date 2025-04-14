import {Component, Inject, Input, NgZone} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AppService} from '../../service/app.service';
import {NotifySeverity, NotifyType} from '../../model/notify.model';

@Component({
  selector: 'home',
  imports: [
    RouterOutlet
  ],
  templateUrl: '../template/control/notify.component.html'
})
export class NotifyComponent {

  @Input({required:true}) name!: string;
  @Input({required:true}) type!: NotifyType;
  @Input({required:true}) severity!: NotifySeverity;

  constructor(protected readonly router:Router) {
    router.navigate(['home/live']);
  }

  ngOnInit() {}
}
