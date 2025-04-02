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
        new News()
      ];
  }
}
