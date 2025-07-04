import isEqual from 'lodash/isEqual';
import {RepositoryEntity} from '../repository-entity';

export enum UserRoleType {
  General = 'General',
  Editor = 'Editor',    // News / other non-personal content
  Admin = 'Admin'
}

export enum PersonRoleType {
  GeneralUser = 'General User',
  BoardMember = 'Board Member'
}

export class UserRole {
  userRole: UserRoleType = UserRoleType.Editor;
  personRole: PersonRoleType = PersonRoleType.GeneralUser;

  public static from(userRole: UserRoleType, personRole:PersonRoleType){
    let result: UserRole = new UserRole();

    result.userRole = userRole;
    result.personRole = personRole;

    return result;
  }
}

export class UserLink {
  url: string = '';
  displayText: string = '';
  displayImageUrl: string = '';
}

export class User extends  RepositoryEntity {
  name: string;
  email: string;
  emailVisible: boolean;
  accountCreation: Date;
  pictureUrl: string;
  shortDescription: string;
  longDescription: string;
  personRole: PersonRoleType;
  userRole: UserRoleType;
  isMockAccount: boolean;

  links: UserLink[];

  constructor() {
    super();
    this.id = -1;
    this.name = 'Not Logged In';
    this.email = '';
    this.accountCreation = new Date();
    this.emailVisible = false;
    this.pictureUrl = '';
    this.shortDescription = '';
    this.longDescription = '';
    this.isMockAccount = true;
    this.links = [];
    this.personRole = PersonRoleType.GeneralUser;
    this.userRole = UserRoleType.General;
  }

  update<T extends RepositoryEntity>(entity: T): void {
    Object.assign(this, entity);
  }

  public static from(userId:number, userName:string, email:string){
    let user:User = new User();
    user.id = userId;
    user.name = userName;
    user.email = email;
    return user;
  }

  public isDefault() {
    return isEqual(this, User.default());
  }

  public static default(){
    return new User();
  }
}
