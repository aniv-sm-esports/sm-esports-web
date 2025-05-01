
export class UserJWTClientDTO {
  public userName: string = '';
  public loginTime: Date = new Date();
  public expirationTime: Date = new Date();

  constructor(userName:string, loginTime:Date, expirationTime:Date) {
    this.userName = userName;
    this.loginTime = loginTime;
    this.expirationTime = expirationTime;
  }
}
