export class UserCreation  {

  userName: string;
  email: string;
  password: string;

  userNameInvalid:boolean;
  emailInvalid:boolean;
  passwordInvalid:boolean;

  userNameValidationMessage:string;
  emailValidationMessage:string;
  passwordValidationMessage:string;

  constructor() {
    this.userName = '';
    this.email = '';
    this.password = '';
    this.userNameInvalid = false;
    this.emailInvalid = false;
    this.passwordInvalid = false;
    this.userNameValidationMessage = '';
    this.emailValidationMessage = '';
    this.passwordValidationMessage = '';
  }

  public update(userCreation:UserCreation){
    Object.assign(this, userCreation);
  }

  public static default(){
    return new UserCreation();
  }
}
