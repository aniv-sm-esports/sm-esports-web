import {RepositoryEntity} from "../repository-entity";
import {PersonRoleType, UserRoleType} from './user.model';

export class ChatRoomSecurityRule extends RepositoryEntity {

  public chatRoomId:number = 0;
  public requiredPersonRole: PersonRoleType = PersonRoleType.GeneralUser;
  public requiredUserRole: UserRoleType = UserRoleType.General;

  update<T extends RepositoryEntity>(entity: T): void {
    Object.assign(this, entity);
  }
}
