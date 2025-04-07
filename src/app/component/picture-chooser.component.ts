import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {formatDate, NgClass, NgForOf, NgOptimizedImage} from '@angular/common';
import {FileService} from '../service/file.service';
import {FileModel} from '../model/file.model';

@Component({
  selector: 'picture-chooser',
  imports: [
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './template/picture-chooser.component.html'
})
export class PictureChooserComponent {

  // File Name
  @Input() pictureFile!:string;

  // File Name Changed
  @Output() pictureFileChanged:EventEmitter<string> = new EventEmitter();

  // Services
  protected readonly fileService:FileService;

  constructor(fileService:FileService) {
    this.fileService = fileService;
  }

  // ********
  // Inputs to DOM must be set during ngOnInit (or some time before they're called)
  // ********
  //
  ngOnInit() {
    this.pictureFile = "picture-placeholder.png";
  }

  onFileChanged($event: Event) {

    // Must cast to the input element to get the file DOM
    let element = $event.target as HTMLInputElement;

    if (!element.files || element.files?.length <= 0) {
      return;
    }

    try {

      let file = new FileModel(element.files[0].name, '');
      file.fileData = element.files[0];

      // Upload File -> Emit Change Event
      this.fileService
        .postFile(file)
        .subscribe(response =>{

        // Success -> Emit Change Event
        if (response.success)
          this.pictureFileChanged.emit(this.pictureFile);
      });
    }
    catch (error){
      console.error(error);
    }
  }
}
