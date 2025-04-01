export interface IUser {
  id: number;
  name: string;
  loggedOn: boolean;
}

export interface IUserResponse {
  user: IUser;
  success: boolean;
  message: string;
}

export interface IGetUsersResponse {
  users: IUser[];
}

export class User implements IUser {
  id: number;
  name: string;
  loggedOn: boolean;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.loggedOn = false;
  }

  static default(){
    return new User(-1, 'Not Logged In');
  }
}

export class UserResponse implements IUserResponse {

  user: IUser;
  success: boolean;
  message: string;

  constructor(user: IUser, success: boolean, message: string) {
    this.user = user;
    this.success = success;
    this.message = message;
  }
}

export class GetUsersResponse implements IGetUsersResponse {
  users: IUser[];

  constructor(users: IUser[]) {
    this.users = users;
  }
}
