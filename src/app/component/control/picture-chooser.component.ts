import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {FileService} from '../../service/file.service';
import {FileModel} from '../../model/repository/file.model';
import {ApiResponseType} from '../../model/service/app.model';

@Component({
  selector: 'picture-chooser',
  imports: [
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './picture-chooser.component.html'
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
    this.pictureFile = "/placeholder/picture-placeholder.png";
  }

  onFileChanged($event: Event) {

    // Must cast to the input element to get the file DOM
    let element = $event.target as HTMLInputElement;

    if (!element.files || element.files?.length <= 0) {
      return;
    }

    try {
      /*
      let file = FileModel.from(element.files[0].name, '');
      file.fileData = element.files[0];

      // Upload File -> Emit Change Event
      this.fileService
        .postFile(file)
        .subscribe(response =>{

        // Success -> Emit Change Event
        if (response.response == ApiResponseType.Success)
          this.pictureFileChanged.emit(this.pictureFile);
      });

       */
    }
    catch (error){
      console.error(error);
    }
  }
}
