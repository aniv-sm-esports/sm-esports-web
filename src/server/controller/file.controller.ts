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

    // Pre-work settings
    this.setLogonRequired(true);

    try {

      let file = new FileModel(request.params.fileName, this.serverDb.publicFolder);

      // Read file using node:fs
      fs.readFile(request.params.fileName, (err, data) => {
        file.fileData = new Blob([data], { type: 'binary' });
      });

      // Send during try/catch
      this.sendSuccess(response, file);
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // GET -> /api/chat/getRoom/:chatRoomRoute
  //
  post(request: Request<{}, ApiResponse<string>, FileModel, ParsedQs, Record<string, any>>,
       response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(true);

    // Validate File
    if (!request.body.name ||
        !request.body.fileData ||
        request.body.fileData.size == 0) {
      this.sendDataError(response, 'File Invalid!');
      return;
    }

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

                 // Error Catch
                 console.log(error);
                 success = false;
               });

               // Success
               if (success) {
                 let file = new FileModel(request.body.name, request.body.directory);
                 this.serverDb.files.push(file);
                 this.sendSuccess(response, 'File uploaded successfully!');
               }

               // Failure
               else {
                 this.sendError(response, 'There was an error saving the file to the server');
               }
      });
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }
}
