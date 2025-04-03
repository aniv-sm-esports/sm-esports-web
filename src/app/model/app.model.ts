import { User } from './user.model'

export class AppModel {
  public users: User[];

  constructor() {
    this.users = [];
  }
}

export class ApiResponse<T> {

  public data: T | undefined;
  public success: boolean;
  public message: string;

  constructor() {
    this.success = false;
    this.message = '';
  }

  public static success<T>(data: T) {
    let result = new ApiResponse<T>();

    result.data = data;
    result.success = true;
    result.message = '';

    return result;
  }
  public static fail<T>(message: string) {
    let result = new ApiResponse<T>();

    result.success = false;
    result.message = message;

    return result;
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
