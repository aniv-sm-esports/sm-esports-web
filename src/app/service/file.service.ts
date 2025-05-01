import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EntityService} from './entity.service';
import {File} from '../../server/entity/model/File';

@Injectable({
  providedIn: 'root'
})
export class FileService extends EntityService<File> {

  // File API: ALL POST ENDPOINTS
  //
  private readonly urlGet = "/api/entity/file/get";
  private readonly urlGetAll = "/api/entity/file/getAll";
  private readonly urlCreate = "/api/entity/file/create";
  private readonly urlGetRepositoryState = "/api/entity/file/getState";
  private readonly urlPostRepositoryClientCheck = "/api/entity/file/checkState";
  private readonly urlPostRepositoryClientState = "/api/entity/file/setState";

  constructor(private httpClient: HttpClient) {
    super('File', 'File', httpClient, new File(), []);
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
