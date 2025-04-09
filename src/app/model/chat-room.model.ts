import {Chat} from './chat.model';
import isEqual from 'lodash/isEqual';

export class ChatRoom {
  public id: number;
  public name: string;
  public description: string;
  public urlRoute: string;
  public chatRulesHtml: string;

  public chats: Chat[];

  constructor() {
    this.id = -1;
    this.name = "";
    this.description = "";
    this.urlRoute = "";
    this.chatRulesHtml = "";
    this.chats = [];
  }

  public containsChat(id: number) {
    return this.chats.some((chat: Chat) => {
      return chat.id == id;
    });
  }

  public getChat(id: number) {
    return this.chats.find((chat) => chat.id == id);
  }

  public update(room: ChatRoom) {
    this.id = room.id;
    this.name = room.name;
    this.description = room.description;
    this.urlRoute = room.urlRoute;
    this.chatRulesHtml = room.chatRulesHtml;
    this.chats = room.chats;
  }

  public clearChats() {
    while (this.chats.length > 0) {
      this.chats.pop();
    }
  }

  public isDefault() {
    return isEqual(this, ChatRoom.default());
  }

  public static default() {
    return new ChatRoom();
  }

  public static from(id: number, name: string, description:string, urlRoute:string, chatRulesHtml:string): ChatRoom {
    let result = new ChatRoom();

    result.id = id;
    result.name = name;
    result.description = description;
    result.urlRoute = urlRoute;
    result.chatRulesHtml = chatRulesHtml;

    return result;
  }
}
