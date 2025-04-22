import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse} from '../../../app/model/service/app.model';
import {NewsControllerName} from '../../service/controller-const';
import {NewsController} from '../../controller/news.controller';
import { Article } from '../../../app/model/repository/entity/article.model';

export class NewsCreateMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public override apply(request: Request<{}, ApiResponse<Article>, ApiRequest<Article>, ParsedQs, Record<string, any>>,
                        response: Response<any, Record<string, any>, number>, next: any) {
    (this.controllerManagerService.getPrimaryController(NewsControllerName) as NewsController).create(request, response);
  }
}
