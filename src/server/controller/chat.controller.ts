import {RepositoryController} from './repository.controller';
import {Chat} from '../../app/model/repository/entity/chat.model';
import {Repository} from '../../app/model/repository/repository.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';
import {SearchModel} from '../../app/model/repository/search.model';
import {BaseController} from './base.controller';
import {RepositoryServer} from '../../app/model/repository/repository-server.model';

export class ChatController extends RepositoryController<Chat> {

  constructor(private readonly chatRoomId:number, serverDb: DataModel, authService: AuthService, isPrimary:boolean) {
    super(serverDb, authService, isPrimary);
  }

  initialize() {

    let chatRoom = this.serverDb.chatRooms.first(x => x.id === this.chatRoomId)!;
    let search = new SearchModel<Chat>(Chat.default(), []);

    // IMPORTANT! Setting base repository! NOTICE KEY!
    this.repository = new RepositoryServer<Chat>(`Chat (${chatRoom.id})`, 'Chat', search, [], true);
    return Chat.default();
  }

  public clone(): BaseController {
    return new ChatController(this.chatRoomId, this.serverDb, this.authService, false);
  }

  getByIdLogonRequired(): boolean {
    return false;
  }

  getEntityName(): string {
    return `Chat Repository (${this.chatRoomId})`;
  }

  getLogonRequired(): boolean {
    return false;
  }

  getPageLogonRequired(): boolean {
    return false;
  }
}
