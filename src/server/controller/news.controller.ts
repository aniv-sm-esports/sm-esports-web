import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { RepositoryController} from './repository.controller';
import {Article} from '../../app/model/repository/article.model';
import {ApiData, ApiRequest, ApiResponse} from '../../app/model/service/app.model';
import {PageData} from '../../app/model/service/page.model';
import {Repository} from '../../app/model/repository/repository.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';

export class NewsController extends RepositoryController<Article> {

  private repository: Repository<Article> = new Repository<Article>('News Repository');

  constructor(serverDb: DataModel, authService: AuthService) {
    super(serverDb, authService);
    this.initialize();
  }

  protected override initialize() {
    this.repository = this.serverDb.news;
  }

  // GET -> /api/news/get/:newsId
  //
  get(request: Request<{newsId:string}, ApiResponse<Article>, ApiRequest<Article>, ParsedQs, Record<string, any>>,
      response: Response<ApiResponse<Article>, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      // Success
      if (this.repository.has(Number(request.params.newsId))) {

        let news = this.repository.get(Number(request.params.newsId)) || Article.default();
        let apiData = ApiData.fromSingle(news);

        // Send during try/catch
        this.sendSuccess(response, apiData, undefined);
        return;
      }

      // Data Error
      else {
        this.sendDataError(response, 'News not found:  ${request.params.newsId}');
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/news/getPage
  //
  getPage(request: Request<{}, ApiResponse<Article>, ApiRequest<Article>, ParsedQs, Record<string, any>>,
          response: Response<ApiResponse<Article>, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      let pageData = request.body.pageData || PageData.firstPage(25);
      let newsItems:Article[] = this.repository.getPage(pageData) || [];

      // Success
      this.sendSuccess(response, ApiData.fromSet(newsItems), pageData);
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/news/create
  //
  create(request: Request<{}, ApiResponse<Article>, ApiRequest<Article>, ParsedQs, Record<string, any>>,
         response: Response<ApiResponse<Article>, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(true);

    // Validation
    if (!request.body.data) {
      this.sendDataError(response, 'An Error has occurred: Must include news article with request body');
      return;
    }

    try {

      let success = true;
      let article = request.body.data as Article;

      // Exists by id
      if (this.repository.has(article.id)) {
        this.sendDataError(response, `An Error has occurred: News article with id ${article.id} already exists`);
        return;
      }

      // Exists by title
      if (this.repository.any(item => item.title === article.title)) {
        this.sendDataError(response, `An Error has occurred: News article with title ${article.title} already exists`);
        return;
      }

      // Assign Id
      article.id = this.repository.getSize();

      // Add News to database
      this.repository.append(article);

      // Success
      this.sendSuccess(response, ApiData.fromSingle(article), undefined);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
