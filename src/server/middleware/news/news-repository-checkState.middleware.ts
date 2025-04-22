import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {AuthControllerName, NewsControllerName, UserControllerName} from '../../service/controller-const';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {NewsController} from '../../controller/news.controller';
import {ApiRequest, ApiResponse } from '../../../app/model/service/app.model';
import { Article } from '../../../app/model/repository/entity/article.model';

export class NewsRepositoryCheckStateMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public apply(request: Request<{}, ApiResponse<Article>, ApiRequest<Article>, ParsedQs, Record<string, any>>,
               response: Response<any, Record<string, any>, number>, next: any) {
    (this.controllerManagerService.getPrimaryController(NewsControllerName) as NewsController).checkState(request, response);
  }
}
