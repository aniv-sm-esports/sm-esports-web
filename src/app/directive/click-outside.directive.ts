import { Directive, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {

  // Emit Event
  @Output() clickOutside:EventEmitter<void> = new EventEmitter<void>();

  // Attach Behavior
  @Input() clickOutsideAttached!:boolean;

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(target:any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside && this.clickOutsideAttached) {
      this.clickOutside.emit();
    }
  }
}
