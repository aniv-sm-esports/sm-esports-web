import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Article} from '../model/article.model';
import {ApiResponse} from '../model/app.model';
import {PageData} from '../model/page.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private readonly http: HttpClient;

  // Users -> Post -> Create User
  urlGet = "/api/news/get/:id";
  urlCreate = "/api/news/create";
  urlGetPage = "/api/news/getPage";

  private readonly headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }

  get(id: number) {
    return this.http.get<ApiResponse<Article>>(this.urlGet.replace(':id', id.toString()));
  }

  create(news: Article) : Observable<ApiResponse<Article>> {
    return this.http.post<ApiResponse<Article>>(this.urlCreate, news, {
      headers: this.headers
    });
  }

  getPage(pageData:PageData): Observable<ApiResponse<Article[]>> {
    return this.http.post<ApiResponse<Article[]>>(this.urlGetPage, pageData, {
      headers: this.headers
    });
  }
}
