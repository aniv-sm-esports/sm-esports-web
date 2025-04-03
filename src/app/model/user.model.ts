export class User {
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
