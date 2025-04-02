import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {News, NewsResponse} from '../model/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private readonly http: HttpClient;

  // Users -> Post -> Create User
  urlGet = "/news/:id";
  urlCreate = "/news/create";
  urlGetAll = "/news/getAll";

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }

  async get(id: number) {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');
    httpHeaders.append('accept', '*');

    let options = {
      headers: httpHeaders,
      withCredentials: true,
      transferCache: {
        includeHeaders: ['content-type', 'accept', '*'],
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true
      }
    };

    return await firstValueFrom<News>(this.http.get<News>(this.urlGet + '/' + id, options));
  }

  create(news: News) : Observable<NewsResponse> {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('Content-Type', 'application/json');
    httpHeaders.append('Accept', '*');
    httpHeaders.append('Access-Control-Allow-Origin', '*');

    let options = {
      headers: httpHeaders,
      withCredentials: true,
      transferCache: {
        includeHeaders: ['content-type', 'accept', '*'],
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true
      }
    };

    return this.http.post<NewsResponse>(this.urlCreate, news, options);
  }

  getAll(): Observable<NewsResponse> {

    let httpHeaders = new HttpHeaders();

    httpHeaders.append('content-type', 'application/json');
    httpHeaders.append('accept', '*');
    httpHeaders.append('Access-Control-Allow-Origin', '*');

    let options = {
      headers: httpHeaders,
      withCredentials: true,
      transferCache: {
        includeHeaders: ['content-type', 'accept', '*'],
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true
      }
    };

    return this.http.get<NewsResponse>(this.urlGetAll, options);
  }
}
