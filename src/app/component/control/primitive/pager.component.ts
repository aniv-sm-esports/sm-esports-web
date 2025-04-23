import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RepositoryState} from '../../../model/repository/repository-state.model';
import { RepositoryEntity } from '../../../model/repository/repository-entity';
import { PageInfo } from '../../../model/service/page.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight} from '@fortawesome/free-solid-svg-icons';
import {RepositoryStateData} from '../../../model/repository/repository-state-data.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: "pager",
  imports: [
    FaIconComponent,
    FormsModule
  ],
  templateUrl: "../../template/control/primitive/pager.component.html"
})
export class PagerComponent<T extends RepositoryEntity> {

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
