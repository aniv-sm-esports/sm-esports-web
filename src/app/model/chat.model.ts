export class Chat {
  userId: number;
  text: string;
  date: Date;
  flagged: boolean;
  flagComments: string;

  constructor() {
    this.userId = -1;
    this.text = '';
    this.date = new Date();
    this.flagged = false;
    this.flagComments = '';
  }
}
