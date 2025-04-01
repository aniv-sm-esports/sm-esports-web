import {Component, Directive, ElementRef, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

/**
 * @title Basic buttons
 */
@Component({
  selector: 'basic-button',
  templateUrl: './template/basic-button.html',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
})
export class BasicButtonComponent {

  // Provides [textValue]="..."
  @Input() text!: string;

  public enabled: boolean;

  constructor() {
    this.enabled = true;
    this.text = 'Button';
  }
}
