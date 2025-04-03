import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {News} from '../../app/model/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsController extends BaseController {

  // GET -> /api/news/get/:newsId
  //
  get(request: Request<{newsId:string}, any, any, ParsedQs, Record<string, any>>,
      response: Response<any, Record<string, any>, number>) {

    this.logRequest(request);

    let news:News = new News();
    let message:string = '';

    try {

      // Success
      if (this.serverDb.news.has(Number(request.params.newsId))) {

        news = this.serverDb.news.get(Number(request.params.newsId)) || new News();

        // Send during try/catch
        this.logResponseSuccess(response, news);
        return;
      }
      else {
        message = `News not found:  ${request.params.newsId}`;
      }
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }

  // GET -> /api/news/getAll
  //
  getAll(request: Request<{}, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    this.logRequest(request);

    let message:string = '';

    try {
      let newsItems:News[] = [];

      this.serverDb.news.forEach((news:News) => {
        newsItems.push(news);
      })

      // Success
      this.logResponseSuccess(response, newsItems);
      return;
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }

  // POST -> /api/news/create
  //
  create(request: Request<{}, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    this.logRequest(request);

    // Mark success to look for existing (true)
    let success:boolean = true;
    let message:string = '';

    try {

      // Exists
      this.serverDb.news.forEach((news:News) => {
        if (news.title.trim() == request.body.title.trim()) {
          success = false;
          message = 'News article (of the same title) already exists';
        }
      });

      // Already exists -> return
      if (!success) {
        this.logResponseFail(response, message);
        return;
      }

      let newsId = this.serverDb.news.size;

      // Set Id
      request.body.id = newsId;

      // Add News to database
      this.serverDb.news.set(newsId, request.body);

      // Success
      this.logResponseSuccess(response, request.body);
      return;
    }
    catch(error) {
      console.log(error);
      success = false;
      message = 'An Error has occurred: See server log for details';
    }

    this.logResponseFail(response, request.body);
  }
}
