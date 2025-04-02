import {Injectable} from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User} from '../app/model/user.model';
import {DataModel} from './model/server.datamodel';
import {News} from '../app/model/news.model';

@Injectable({
  providedIn: 'root'
})

export class DbService implements InMemoryDbService {

  private readonly db: DataModel;

  constructor() {
    this.db = {
      users: [
        new User(0, 'aniv-sm-esports')
      ],
      news: [
        new News(0, 'Super Metroid by Andy, Oatsngoats, imyt and Eddie in 1:19:50 - Awesome Games Done Quick 2025',
                    '(TBD:  Article Writer! Please send your request to be the official SM Esports Journalist!)',
                    '(ARTICLE BODY)',
                    new Date('2025-01-12'))
      ]
    }
  }

  // Interface implementation
  createDb() : DataModel {
    return this.db;
  }

  addUser(user: User)  {

    try
    {
      if (this.db.users.some((value) =>
      {
        return value.name == user.name || value.id == user.id;
      })){
        console.log('User already exists');
        return;
      }

      this.db.users.push(user);
    }
    catch(err)
    {
      console.log("Error adding user");
      console.log(user);
      console.log(err);
    }

  }
}
