import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {Article} from '../../app/model/article.model';

export class NewsController extends BaseController {

  // GET -> /api/news/get/:newsId
  //
  get(request: Request<{newsId:string}, any, any, ParsedQs, Record<string, any>>,
      response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      // Success
      if (this.serverDb.news.has(Number(request.params.newsId))) {

        let news = this.serverDb.news.get(Number(request.params.newsId)) || new Article();

        // Send during try/catch
        this.sendSuccess(response, news);
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

  // GET -> /api/news/getAll
  //
  getAll(request: Request<{}, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    try {
      let newsItems:Article[] = [];

      this.serverDb.news.forEach((news:Article) => {
        newsItems.push(news);
      })

      // Success
      this.sendSuccess(response, newsItems);
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/news/create
  //
  create(request: Request<{}, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(true);

    try {

      let success = true;

      // Exists
      this.serverDb.news.forEach((news:Article) => {
        if (news.title.trim() == request.body.title.trim()) {
          success = false;
          this.sendDataError(response, 'News article (of the same title) already exists');
        }
      });

      if (!success)
        return;

      let newsId = this.serverDb.news.size;

      // Set Id
      request.body.id = newsId;

      // Add News to database
      this.serverDb.news.set(newsId, request.body);

      // Success
      this.sendSuccess(response, request.body);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
