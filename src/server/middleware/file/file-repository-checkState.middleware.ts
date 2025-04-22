import {ControllerManagerService} from '../../service/controller-manager.service';
import {HttpMethod, MiddlewareBase} from '../base.middleware';
import {FileControllerName} from '../../service/controller-const';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {ApiRequest, ApiResponse } from '../../../app/model/service/app.model';
import {FileModel} from '../../../app/model/repository/entity/file.model';
import {FileController} from '../../controller/file.controller';

export class FileRepositoryCheckStateMiddleware extends MiddlewareBase {

  constructor(controllerManagerService: ControllerManagerService,
              route: string,
              method: HttpMethod) {
    super(controllerManagerService, route, method);
  }

  public apply(request: Request<{}, ApiResponse<FileModel>, ApiRequest<FileModel>, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>, number>, next: any) {
    (this.controllerManagerService.getPrimaryController(FileControllerName) as FileController).checkState(request, response);
  }
}
