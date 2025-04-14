export class Tab {
  name: string;
  route: string;

  public constructor(){
    this.name = '';
    this.route = '';
  }

  public static default() {
    return new Tab();
  }

  public static from(theName: string, theRoute: string) {
    let result = new Tab();
    result.name = theName;
    result.route = theRoute;
    return result;
  }
}
