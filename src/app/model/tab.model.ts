import {Chat} from './chat.model';

export class Tab {
  name: string;
  route: string;

  constructor(theName: string, theRoute: string) {
    this.name = theName;
    this.route = theRoute;
  }
}
