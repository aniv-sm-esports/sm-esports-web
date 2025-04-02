import {User} from '../../app/model/user.model';
import {News} from '../../app/model/news.model';

export class DataModel {
  users: User[] = [];
  news: News[] = [];

  constructor() {
      this.users = [
        new User(0, 'aniv-sm-esports')
      ];
      this.news = [
        new News(0, 'Super Metroid by Andy, Oatsngoats, imyt and Eddie in 1:19:50 - Awesome Games Done Quick 2025',
          '(TBD:  Article Writer! Please send your request to be the official SM Esports Journalist!)',
          '(ARTICLE BODY)',
          new Date('2025-01-12'))
      ];
  }
}
