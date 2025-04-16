import {Component, EventEmitter, Inject, Input, NgZone, Output, SimpleChanges} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AppService} from '../../service/app.service';
import {NotifySeverity, NotifyType} from '../../model/service/notify.model';
import moment, {Moment} from 'moment';
import {TimeService} from '../../service/time.service';
import {TimeHandler} from '../../model/service/handler.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'notify',
  imports: [
    RouterOutlet,
    NgClass
  ],
  templateUrl: '../template/control/notify.component.html'
})
export class NotifyComponent implements TimeHandler {

  // Input Values
  //
  @Input({required:true}) name!: string;
  @Input({required:true}) type!: NotifyType;
  @Input({required:true}) severity!: NotifySeverity;
  @Input({required:true}) message!: string;
  @Input() expirationDate: Moment = moment().add(120, 'seconds');

  // Output Values
  //
  @Output() notify:EventEmitter<Moment> = new EventEmitter<Moment>();
  @Input() expired:boolean = false;

  constructor(protected readonly router:Router, private timeService:TimeService) {

  }

  // ngOnInit -> ngOnChanges -> .. -> ngAfterViewInit
  //
  ngAfterViewInit() {

    // Input variables should now be loaded
    //
    this.timeService.setOnceDate(this.expirationDate, this);
  }

  onReady(value:Moment) {

    // -> Just Before Expired (should probably be promise / observable)
    this.notify.emit(moment());

    // Temporary
    if (this.type == NotifyType.Temporary) {
      this.expired = true;
    }

    // Permanent (would be for clock or something that doesn't need to be destroyed)
  }

  protected readonly NotifySeverity = NotifySeverity;
}
