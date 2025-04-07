import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {ApiResponse} from '../../app/model/app.model';
import {FileModel} from '../../app/model/file.model';
import * as fs from 'node:fs';

@Injectable({
  providedIn: 'root'
})
export class FileController extends BaseController {

  // GET -> /api/file/get/:fileName
  //
  get(request: Request<{fileName:string}, FileModel, any, ParsedQs, Record<string, any>>,
      response: Response<any, Record<string, any>, number>) {

    this.logRequest(request);

    let message:string = '';

    try {

      let file = new FileModel(request.params.fileName, this.serverDb.publicFolder);

      // Read file using node:fs
      fs.readFile(request.params.fileName, (err, data) => {
        file.fileData = new Blob([data], { type: 'binary' });
      });

      // Send during try/catch
      this.logResponseSuccess(response, file);
      return;
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    this.logResponseFail(response, message);
  }

  // GET -> /api/chat/getRoom/:chatRoomRoute
  //
  post(request: Request<{}, ApiResponse<string>, FileModel, ParsedQs, Record<string, any>>,
       response: Response<any, Record<string, any>, number>) {

    this.logRequest(request);

    // Validate File
    if (!request.body.name ||
        !request.body.fileData ||
        request.body.fileData.size == 0) {
      this.logResponseFail(response, 'File Invalid!');
      return ;
    }

    let message:string = '';
    let success:boolean = true;

    try {

      // Procedure
      //
      // 1) Save file to disk
      // 2) Remove blob from memory
      // 3) Store the entry (as not loaded)
      // 4) Return success
      //

      // Blob -> Array Buffer -> Save Data
      request.body
             .fileData
             .arrayBuffer()
             .then(data => {

               // Write File
               fs.writeFile(request.body.name, new DataView(data),
                 (error) => {

                 // Error
                 console.log(error);
                 message = 'There was an error saving the file to the server';
                 success = false;
               });

               // Success
               if (success) {
                 let file = new FileModel(request.body.name, request.body.directory);
                 this.serverDb.files.push(file);
                 this.logResponseSuccess(response, 'File uploaded successfully!');
               }
      });
    }
    catch(error) {
      console.log(error);
      message = 'An Error has occurred: See server log for details';
    }

    // Failure
    if (!success) {
      this.logResponseFail(response, message);
    }
  }
}
