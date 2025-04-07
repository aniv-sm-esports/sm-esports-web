
export class FileModel {
  public name:string = '';
  public directory:string = '';
  public fileData:Blob = new Blob([]);
  public isLoaded:boolean = false;

  constructor(name:string, directory:string) {
    this.name = name;
    this.directory = directory;
    this.fileData = new Blob([]);
    this.isLoaded = false;
  }
}
