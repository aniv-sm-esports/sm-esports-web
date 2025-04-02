import { IUser } from './user.model'

export class AppModel {
  public users: IUser[];

  constructor() {
    this.users = [];
  }
}

export class Size {
  public width: number = 0;
  public height: number = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
