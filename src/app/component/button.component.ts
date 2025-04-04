import {Component, Directive, ElementRef, Input} from '@angular/core';
import {NgForOf} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

/**
 * @title Basic buttons
 */
@Component({
  selector: 'sm-esports-button',
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './template/button.component.html'
})
export class BasicButtonComponent {

  // Provides [textValue]
  @Input() text!: string;

  // Provides [route]
  @Input() route!: string;

  // Provides [disabled]
  @Input() disabled!: boolean;

  constructor() {
    this.disabled = false;
    this.text = 'Button';
    this.route = 'not set';
  }
}
