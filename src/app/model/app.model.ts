import { IUser } from './user.model'

export class AppModel {
  public users: IUser[];

  constructor() {
    this.users = [];
  }
}
