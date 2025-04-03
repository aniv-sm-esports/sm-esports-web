import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {News} from '../model/news.model';
import {ApiResponse} from '../model/app.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private readonly http: HttpClient;

  // Users -> Post -> Create User
  urlGet = "/api/news/get/:id";
  urlCreate = "/api/news/create";
  urlGetAll = "/api/news/getAll";

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }

  get(id: number) {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.get<ApiResponse<News>>(this.urlGet.replace(':id', id.toString()), options);
  }

  create(news: News) : Observable<ApiResponse<News>> {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('Content-Type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.post<ApiResponse<News>>(this.urlCreate, news, options);
  }

  getAll(): Observable<ApiResponse<News[]>> {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.get<ApiResponse<News[]>>(this.urlGetAll, options);
  }
}
