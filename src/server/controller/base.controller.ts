import { Request, Response} from 'express-serve-static-core';
import {ApiResponse} from '../../app/model/app.model';
import {DataModel} from '../model/server.datamodel';
import {ParsedQs} from 'qs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseController {

  constructor(protected readonly serverDb: DataModel) {
  }

  logRequest(request: Request<{}, any, any, ParsedQs, Record<string, any>>) {
    if (!request) {
      console.log('Server Request not properly formed!');
      return;
    }

    console.log(`Server Request:  ${request?.url}`);
    //console.log(request);
  }

  logResponseSuccess<T>(response: Response<any, Record<string, any>, number>, data:T) {
    if (!response){
      console.log('Server Response not properly formed!');
      return;
    }

    console.log(`Server Response (Success!): ${response?.req.url}`);
    //console.log(response);
    response.send(ApiResponse.success<T>(data));
  }

  logResponseFail<T>(response: Response<any, Record<string, any>, number>, message:string) {

    if (!response) {
      console.log('Server Response not properly formed!');
      return;
    }

    console.log(`Server Response (Failure!): ${response?.req.url}`);
    console.log(message);
    response.send(ApiResponse.fail<T>(message));
  }
}
