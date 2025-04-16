import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';

/**
 * @title Basic buttons
 */
@Component({
  selector: 'sm-esports-select',
  imports: [
    FormsModule,
    NgClass,
    NgSelectComponent
  ],
  templateUrl: '../../template/control/primitive/sm-esports-select.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BasicCheckboxComponent {

  // Provides [model] -> [(ngModel)]
  @Input() model!:any;

  // Provides [items]
  @Input() items!: string[];

  // Provides [disabled]
  @Input() disabled!: boolean;

  @Output('checkChanged') onChangedEvent = new EventEmitter<any>();

  constructor() {
  }

  onChanged($event: Event) {
    this.onChangedEvent.emit(this.model);
  }
}
