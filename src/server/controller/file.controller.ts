import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { RepositoryController} from './repository.controller';
import {ApiData, ApiRequest, ApiResponse} from '../../app/model/service/app.model';
import {FileModel} from '../../app/model/repository/file.model';
import * as fs from 'node:fs';
import {Repository} from '../../app/model/repository/repository.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';

export class FileController extends RepositoryController<FileModel> {

  private repository: Repository<FileModel> = new Repository<FileModel>('File Repository');

  constructor(serverDb: DataModel, authService: AuthService) {
    super(serverDb, authService);
    this.initialize();
  }

  protected override initialize() {
    this.repository = this.serverDb.files;
  }

  // GET -> /api/file/get/:fileName
  //
  get(request: Request<{fileName:string}, ApiResponse<FileModel>, ApiRequest<FileModel>, ParsedQs, Record<string, any>>,
      response: Response<ApiResponse<FileModel>, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(true);

    try {

      let fileId = this.repository.getSize();
      let file = FileModel.from(fileId, request.params.fileName, this.serverDb.publicFolder);

      // Read file using node:fs
      fs.readFile(request.params.fileName, (err, data) => {
        file.fileData = new Blob([data], { type: 'binary' });
      });

      // Send during try/catch
      this.sendSuccess(response, ApiData.fromSingle(file), undefined);
      return;
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/file/getRoom/:chatRoomRoute
  //
  post(request: Request<{}, ApiResponse<FileModel>, ApiRequest<FileModel>, ParsedQs, Record<string, any>>,
       response: Response<ApiResponse<FileModel>, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(true);

    // Validate File
    if (!request.body.data?.name ||
        !request.body.data?.fileData ||
        request.body.data?.fileData.size == 0) {
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
      let file = request.body.data!;
      file.fileData
          .arrayBuffer()
           .then(data => {

             // Write File
             fs.writeFile(file.name, new DataView(data),
               (error) => {

               // Error Catch
               console.log(error);
               success = false;
             });

             // Success
             if (success) {
               let fileId = this.repository.getSize();
               let fileModel = FileModel.from(fileId, file.name, file.directory);
               this.repository.append(fileModel);
               this.sendSuccess(response, ApiData.fromSingle(fileModel), undefined);
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
