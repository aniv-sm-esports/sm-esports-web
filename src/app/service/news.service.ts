import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Article} from '../model/article.model';
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

    return this.http.get<ApiResponse<Article>>(this.urlGet.replace(':id', id.toString()), options);
  }

  create(news: Article) : Observable<ApiResponse<Article>> {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('Content-Type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.post<ApiResponse<Article>>(this.urlCreate, news, options);
  }

  getAll(): Observable<ApiResponse<Article[]>> {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');

    let options = {
      headers: httpHeaders
    };

    return this.http.get<ApiResponse<Article[]>>(this.urlGetAll, options);
  }
}
