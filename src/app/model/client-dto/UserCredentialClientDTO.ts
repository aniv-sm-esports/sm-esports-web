export class UserCredentialClientDTO {
  userName: string = "";
  password: string = "";

  public static fromLogon(userName:string, password:string) {
    let result = new UserCredentialClientDTO();
    result.userName = userName;
    result.password = password;
    return result;
  }
}
