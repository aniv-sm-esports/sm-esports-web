import {Component, Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

/**
 * @title Basic buttons
 */
@Component({
  selector: 'sm-esports-checkbox',
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './template/checkbox.component.html'
})
export class BasicCheckboxComponent {

  // Provides [text]
  @Input() text!: string;

  // Provides [disabled]
  @Input() disabled!: boolean;

  // Provides [value]
  @Input() checked!: boolean;

  @Output('checkChanged') checkChanged = new EventEmitter<boolean>();

  constructor() {
  }

  onChanged($event: Event) {
    this.checkChanged.emit(this.checked);
  }
}
