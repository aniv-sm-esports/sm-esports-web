import { RepositoryController} from './repository.controller';
import {FileModel} from '../../app/model/repository/entity/file.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {BaseController} from './base.controller';

export class FileController extends RepositoryController<FileModel> {

  constructor(serverDb: DataModel, authService: AuthService, isPrimaryRepository:boolean) {
    super(serverDb, authService, isPrimaryRepository);
  }

  initialize() {
    if (this.initialized)
      return;

    this.repository = this.serverDb.files;
    this.defaultEntity = FileModel.default();
    this.initialized = true;
  }

  public clone(): BaseController {
    return new FileController(this.serverDb, this.authService, false);
  }

  getByIdLogonRequired(): boolean {
    return false;
  }

  getEntityName(): string {
    return 'FileModel';
  }

  getLogonRequired(): boolean {
    return false;
  }

  getPageLogonRequired(): boolean {
    return false;
  }

/*
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
  }*/
}
