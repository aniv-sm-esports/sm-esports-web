
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

export class User {
  id: number;
  name: string;
  email: string;
  emailVisible: boolean;
  pictureUrl: string;
  shortDescription: string;
  longDescription: string;
  roleInfo: UserRole;

  links: UserLink[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.email = '';
    this.emailVisible = false;
    this.pictureUrl = '';
    this.shortDescription = '';
    this.longDescription = '';
    this.links = [];
    this.roleInfo = UserRole.from(UserRoleType.General, PersonRoleType.GeneralUser);
  }

  static default(){
    return new User(-1, 'Not Logged In');
  }
}
