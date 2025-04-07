import {Component, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() value!: boolean;

  constructor() {
    this.value = false;
    this.disabled = false;
    this.text = 'Check Box';
  }
}
