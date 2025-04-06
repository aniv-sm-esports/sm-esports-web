
export class UserLogon {
  public userName: string = '';
  public password: string = '';
  public logonTime: Date = new Date();
  public expiresAt: Date = new Date();
  public token: string = '';

  public static fromLogon(userName:string, password:string): UserLogon {
    let result:UserLogon = new UserLogon();

    result.userName = userName;
    result.password = password;

    return result;
  }
}
