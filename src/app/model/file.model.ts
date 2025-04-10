
export class FileModel {
  public name:string = '';
  public directory:string = '';
  public fileData:Blob = new Blob([]);
  public isLoaded:boolean = false;

  constructor() {
    this.name = '';
    this.directory = '';
    this.fileData = new Blob([]);
    this.isLoaded = false;
  }

  public static default() {
    return new FileModel();
  }

  public static from(name:string, directory:string) {
    let result = new FileModel();
    result.name = name;
    result.directory = directory;
    result.fileData = new Blob([]);
    result.isLoaded = false;
    return result;
  }
}
