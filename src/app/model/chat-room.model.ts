import {Chat} from './chat.model';

export class ChatRoom {
  public id: number;
  public name: string;
  public description: string;
  public chatRulesHtml: string;

  public chats: Chat[];

  constructor() {
    this.id = -1;
    this.name = "";
    this.description = "";
    this.chatRulesHtml = "";
    this.chats = [];
  }

  public static from(id: number, name: string, description:string, chatRulesHtml:string): ChatRoom {
    let result = new ChatRoom();

    result.id = id;
    result.name = name;
    result.description = description;
    result.chatRulesHtml = chatRulesHtml;

    return result;
  }
}
