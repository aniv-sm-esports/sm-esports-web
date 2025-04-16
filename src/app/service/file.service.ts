import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiResponse} from '../model/service/app.model';
import {FileModel} from '../model/repository/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly http: HttpClient;

  // File API
  //
  urlGetFile = "/api/file/get/:fileName";
  urlPostFile = "/api/file/post";

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }

  getFile(fileName:string) {
    return this.http.get<ApiResponse<FileModel>>(this.urlGetFile);
  }

  postFile(file:FileModel) {
    return this.http.post<ApiResponse<FileModel>>(this.urlPostFile, file);
  }
}
