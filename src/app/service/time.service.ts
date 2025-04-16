import {Injectable} from '@angular/core';
import moment, {Moment} from 'moment';
import {AsyncSubject, BehaviorSubject, Observable} from 'rxjs';
import {TimeHandler} from '../model/service/handler.model';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor(){

  }

  ngOnInit() {}
  ngOnDestroy() {}

  public setOnceSeconds(seconds:number, handler:TimeHandler){
    this.addSingle(moment().add(seconds, 'seconds'), handler);
  }
  public setOnceDate(date:Moment, handler:TimeHandler){

    if (date.isBefore(moment.now())) {
      console.log("Error setting date watch: must use future date");
      return;
    }

    let seconds = moment(date.diff(moment.now())).seconds();

    this.addSingle(moment().add(seconds, 'seconds'), handler);
  }

  public setRecurringSeconds(seconds:number, handler:TimeHandler) {
    this.addRecurring(moment().add(seconds, 'seconds'), handler);
  }

  private addSingle(date:Moment, handler:TimeHandler) {

    if (date.isBefore(moment.now())) {
      console.log("Error setting date watch: must use future date");
      return;
    }

    // Subject
    let subject = new AsyncSubject<Moment>();

    // Observable
    let observable = subject.asObservable();

    // Subscribe using provided handler
    observable.subscribe(value => {
      handler.onReady(value);
    });

    // Set timeout
    setTimeout(() => {

    }, moment(date.diff(moment.now())).milliseconds());
  }

  private addRecurring(date:Moment, handler:TimeHandler) {

    if (date.isBefore(moment.now())) {
      console.log("Error setting date watch: must use future date");
      return;
    }

    // Subject
    let subject = new AsyncSubject<Moment>();

    // Observable
    let observable = subject.asObservable();

    // Subscribe using provided handler
    observable.subscribe(value => {
      handler.onReady(value);
    });

    // Set timeout
    setInterval(() => {

    }, moment(date.diff(moment.now())).milliseconds());
  }

}
