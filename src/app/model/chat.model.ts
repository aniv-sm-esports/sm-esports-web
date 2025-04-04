export class Chat {
  id: number;
  userId: number;
  userName: string;
  text: string;
  date: Date;
  flagged: boolean;
  flagComments: string;

  constructor() {
    this.id = -1;
    this.userId = -1;
    this.userName = '';
    this.text = '';
    this.date = new Date();
    this.flagged = false;
    this.flagComments = '';
  }

  update(chat: Chat) {
    this.id = chat.id;
    this.userId = chat.userId;
    this.userName = chat.userName;
    this.text = chat.text;
    this.date = chat.date;
    this.flagged = chat.flagged;
    this.flagComments = chat.flagComments;
  }

  public static fromUser(userId: number, userName: string, text: string) {
    let chat = new Chat();

    chat.userId = userId;
    chat.userName = userName;
    chat.text = text;
    chat.date = new Date();

    return chat;
  }
}
