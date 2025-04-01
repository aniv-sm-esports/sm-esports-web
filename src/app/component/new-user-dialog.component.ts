import {afterNextRender, ChangeDetectionStrategy, Component, EventEmitter, inject, Output} from '@angular/core';
import {FormsModule, FormControl, FormBuilder, FormControlOptions, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {ModalModule, ModalReference} from '@developer-partners/ngx-modal-dialog';
import {InputWithHintsComponent} from './input-with-hints';
import {User} from '../model/user.model';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogContent, MatDialogTitle, MatDialog, MatDialogClose} from '@angular/material/dialog';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {NgForOf} from '@angular/common';

/**
 * @title Dialog Animations
 */
@Component({
  selector: 'new-user-dialog',
  templateUrl: './template/new-user-dialog.component.html',
  imports: [ModalModule, FormsModule, InputWithHintsComponent, MatButton, MatDialogTitle, MatDialogContent, MatFormField, MatLabel, MatError, MatDialogActions, MatDialogClose, MatInput, ReactiveFormsModule, NgForOf],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewUserDialogComponent {

  @Output() userValue: EventEmitter<string> = new EventEmitter(false);

  // Used for communicating entered user the parent of the dialog
  readonly userService: UserService;
  readonly dialog: MatDialog = inject(MatDialog);

  // User name <- (dialog erases data during its close procedure)
  public userInput: string = '';

  constructor(userService: UserService) {
    this.userService = userService;
  }

  showDialog(){

    // Show Dialog
    return this.dialog.open(NewUserDialogComponent, {
      id: '1',
      data: this.userInput,
      width: '350px',
      disableClose: true,
      enterAnimationDuration: 50,
      exitAnimationDuration: 50
    });
  }

  // TODO: Find a way to prevent the dialog from destroying the bound data during
  //       its lifecycle!
  update() {
    this.userValue.emit(this.userInput);
  }

  getErrorMessage(){

    if (!this.userInput)
      return '';

    if (!this.userInput)
      return 'Please Enter User Name';

    else if (this.userInput.length > 50)
      return 'Must be less than 50 characters';

    else if (this.userInput.includes(' '))
      return 'Must not contain white spaces';

    else
      return '';
  }
}
