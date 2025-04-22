import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FileModel} from '../model/repository/entity/file.model';
import {RepositoryService} from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class FileService extends RepositoryService<FileModel> {

  // File API: ALL POST ENDPOINTS
  //
  private readonly urlGet = "/api/file/get";
  private readonly urlGetAll = "/api/file/getAll";
  private readonly urlCreate = "/api/file/create";
  private readonly urlGetRepositoryState = "/api/repository/file/getState";
  private readonly urlPostRepositoryClientCheck = "/api/repository/file/checkState";
  private readonly urlPostRepositoryClientState = "/api/repository/file/setState";

  constructor(private httpClient: HttpClient) {
    super('File', 'File', httpClient, FileModel.default(), []);
  }

  protected getEntityName(): string {
    return 'File';
  }

  // TODO
  protected getRepositoryKey(): string {
    return this.getEntityName();
  }

  protected getRepositoryStateUrl(): string {
    return this.urlGetRepositoryState;
  }
  protected getRepositoryClientCheckUrl(): string {
    return this.urlPostRepositoryClientCheck;
  }

  protected getRepositoryClientStateUrl(): string {
    return this.urlPostRepositoryClientState;
  }
  protected getUrl(): string {
    return this.urlGet;
  }
  protected getAllUrl(): string {
    return this.urlGetAll;
  }
  protected createUrl(): string {
    return this.urlCreate;
  }
}
