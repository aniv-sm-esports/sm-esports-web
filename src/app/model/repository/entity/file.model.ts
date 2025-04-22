import {RepositoryEntity} from '../repository-entity';

export class FileModel extends RepositoryEntity{
  public name:string = '';
  public directory:string = '';
  public fileData:Blob = new Blob([]);
  public isLoaded:boolean = false;

  constructor() {
    super();
    this.name = '';
    this.directory = '';
    this.fileData = new Blob([]);
    this.isLoaded = false;
  }

  update<T extends RepositoryEntity>(entity: T): void {
    Object.assign(this, entity);
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
