import {UserJWT} from '../service/user-logon.model';
import {RepositoryEntity} from './repository-entity';

export class Chat extends RepositoryEntity {

  userName: string;
  text: string;
  date: Date;
  flagged: boolean;
  flagComments: string;

  constructor() {
    super();
    this.userName = '';
    this.text = '';
    this.date = new Date();
    this.flagged = false;
    this.flagComments = '';
  }

  update(chat: Chat) {
    this.id = chat.id;
    this.userName = chat.userName;
    this.text = chat.text;
    this.date = chat.date;
    this.flagged = chat.flagged;
    this.flagComments = chat.flagComments;
  }

  public static default() {
    return new Chat();
  }

  public static from(id: number, userName: string, text: string) {
    let chat = new Chat();

    chat.id = id;
    chat.userName = userName;
    chat.text = text;
    chat.date = new Date();

    return chat;
  }

  public static fromUser(userName: string, text: string) {
    let chat = new Chat();

    chat.userName = userName;
    chat.text = text;
    chat.date = new Date();

    return chat;
  }

  public static fromUserJWT(userJWT: UserJWT, text: string) {
    let chat = new Chat();

    chat.userName = userJWT.userName;
    chat.text = text;
    chat.date = new Date();

    return chat;
  }
}
