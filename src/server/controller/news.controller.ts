import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {Article} from '../../app/model/article.model';
import {ApiResponse} from '../../app/model/app.model';
import {PageData} from '../../app/model/page.model';

export class NewsController extends BaseController {

  // GET -> /api/news/get/:newsId
  //
  get(request: Request<{newsId:string}, any, any, ParsedQs, Record<string, any>>,
      response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      // Success
      if (this.serverDb.news.some(news => news.id == Number(request.params.newsId))) {

        let news = this.serverDb.news.find(x => x.id == Number(request.params.newsId)) || new Article();

        // Send during try/catch
        this.sendSuccess(response, news, undefined);
        return;
      }

      // Data Error
      else {
        this.sendDataError(response, Article.default(), 'News not found:  ${request.params.newsId}');
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/news/getPage
  //
  getPage(request: Request<{}, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    try {
      let newsItems:Article[] = [];

      this.serverDb.news.forEach((news:Article) => {
        newsItems.push(news);
      })

      // Success
      this.sendSuccess(response, newsItems, PageData.fromResponse(1, 50, this.serverDb.news.length));
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/news/create
  //
  create(request: Request<{}, ApiResponse<Article>, Article, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(true);

    try {

      let success = true;

      // Exists
      this.serverDb.news.forEach((news:Article) => {
        if (news.title.trim() == request.body.title.trim()) {
          success = false;
          this.sendDataError(response, Article.default(), 'News article (of the same title) already exists');
        }
      });

      if (!success)
        return;

      let news = Object.assign({}, request.body);

      // Assign Id
      news.id = this.serverDb.news.length;

      // Add News to database
      this.serverDb.news.push(news);

      // Success
      this.sendSuccess(response, news, undefined);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
