
export class FileModel {
  public id:number = -1;
  public name:string = '';
  public directory:string = '';
  public fileData:Blob = new Blob([]);
  public isLoaded:boolean = false;

  constructor() {
    this.id = -1;
    this.name = '';
    this.directory = '';
    this.fileData = new Blob([]);
    this.isLoaded = false;
  }

  public static default() {
    return new FileModel();
  }

  public static from(id:number, name:string, directory:string) {
    let result = new FileModel();
    result.id = id;
    result.name = name;
    result.directory = directory;
    result.fileData = new Blob([]);
    result.isLoaded = false;
    return result;
  }
}
