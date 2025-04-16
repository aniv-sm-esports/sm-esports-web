export class Button {
  public text: string;
  public handler: Function | undefined;

  constructor(text: string, handler: Function | undefined) {
    this.text = text;
    this.handler = handler;
  }
}
