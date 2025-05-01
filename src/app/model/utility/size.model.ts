export class Size {
  public width: number = 0;
  public height: number = 0;

  constructor() {
  }

  public static default() {
    return new Size();
  }

  public static from(width: number, height: number){
    let result = new Size();
    result.width = width;
    result.height = height;
    return result;
  }

  public static scaled(width: number, height: number, multiplier:number){
    let result = new Size();
    result.width = width * multiplier;
    result.height = height * multiplier;
    return result;
  }
}
