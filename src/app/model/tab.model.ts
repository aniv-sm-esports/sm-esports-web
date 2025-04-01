import {Chat} from './chat.model';

export class Tab {
  name: string;
  route: string;
  index: number;
  chats: Chat[];

  constructor(theName: string, theRoute: string, theIndex: number) {
    this.name = theName;
    this.route = theRoute;
    this.index = theIndex;
    this.chats = [];
  }
}
