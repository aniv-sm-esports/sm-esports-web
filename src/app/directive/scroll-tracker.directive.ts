import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[scrollTracker]',
  outputs: ['scrollHeightReached'],
})
export class ScrollTrackerDirective {

  @Output() scrollHeightReached: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  @HostListener('scroll', ['$event.target'])
  onScroll(elem: {
    offsetHeight: any;
    scrollTop: any;
    scrollHeight: number;
  }){

    // TODO: BUG ON SECONDARY MONITOR
    if(( elem.offsetHeight + elem.scrollTop) >=  elem.scrollHeight) {
      this.scrollHeightReached.emit(true);
    }
  }
}
