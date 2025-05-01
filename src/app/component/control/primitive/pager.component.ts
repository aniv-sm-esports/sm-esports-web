import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight} from '@fortawesome/free-solid-svg-icons';
import {FormsModule} from '@angular/forms';
import {Entity} from '../../../../server/entity/model/Entity';

@Component({
  selector: "pager",
  imports: [
    FaIconComponent,
    FormsModule
  ],
  templateUrl: "../../template/control/primitive/pager.component.html"
})
export class PagerComponent<T extends Entity<T>> {

  @Input('page-number') pageNumber!: number;
  @Input('page-number-last') pageNumberLast!: number;
  @Input('page-size') pageSize!: number;

  @Output() pageInfoChanged!: EventEmitter<number>;

  protected readonly faAnglesLeft = faAnglesLeft;
  protected readonly faAngleLeft = faAngleLeft;
  protected readonly faAnglesRight = faAnglesRight;
  protected readonly faAngleRight = faAngleRight;

  constructor() {
    this.pageInfoChanged = new EventEmitter();
  }

  onChanged(): void {
    this.pageInfoChanged.emit(this.pageNumber);
  }
}
