import {Chat} from './chat.model';
import isEqual from 'lodash/isEqual';
import {RepositoryEntity} from '../repository-entity';

export class ChatRoom extends RepositoryEntity {
  public name: string;
  public description: string;
  public urlRoute: string;
  public chatRulesHtml: string;

  public chats: Chat[];

  constructor() {
    super();
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

  update<T extends RepositoryEntity>(entity: T): void {
    Object.assign(this, entity);
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
