import {PersonRoleType, User, UserRole, UserRoleType} from '../../app/model/repository/user.model';
import {Article, BannerLinkType} from '../../app/model/repository/article.model';
import {ChatRoom} from '../../app/model/repository/chat-room.model';
import {Chat} from '../../app/model/repository/chat.model';
import {ChatRoomUserMap} from '../../app/model/repository/chat-room-user-map.model';
import {Injectable} from '@angular/core';
import {randomInt} from 'node:crypto';
import {UserCredentials, UserJWTPayload} from '../../app/model/service/user-logon.model';
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import {FileModel} from '../../app/model/repository/file.model';
import * as fs from 'node:fs';
import { SearchModel } from '../../app/model/service/search.model';
import {stringify} from 'node:querystring';
import {Repository} from '../../app/model/repository/repository.model';
import {RepositoryState} from '../../app/model/repository/repository-state.model';

@Injectable({
  providedIn: 'root'
})
export class DataModel {

  public readonly publicFolder: string = 'public';

  credentials: UserCredentials[];
  chatRoomUserMap: ChatRoomUserMap;
  chatRooms: Repository<ChatRoom>;
  users: Repository<User>;
  news: Repository<Article>;
  files: Repository<FileModel>;

  // Auth Service (this may move to separate auth server)
  userTokenMap: Map<string, string>;
  tokenMap: Map<string, UserJWTPayload>;

  constructor() {

    this.chatRooms = new Repository<ChatRoom>('Chat Room Repository');
    this.users = new Repository<User>('User Repository');
    this.chatRoomUserMap = new ChatRoomUserMap();
    this.credentials = [];
    this.files = new Repository<FileModel>('File Repository');
    this.news = new Repository<Article>('News Article Repository');
    this.userTokenMap = new Map<string, string>();
    this.tokenMap = new Map<string, UserJWTPayload>();

    // Server Application Defaults
    let chatRooms = new Array<ChatRoom>();
    let users = new Array<User>();
    let news = new Array<Article>();
    let files = new Array<FileModel>();

    // Users
    let zoasty = User.from(0, 'zoasty', 'zoasty@nomail.com');
    let zeni = User.from(1, 'ShinyZeni', 'zeni@nomail.com');
    let oatsngoats = User.from(2, 'Oatsngoats', 'oatsngoats@nomail.com');
    let eddie = User.from(3, 'Eddie', 'eddie@nomail.com');
    let nevdi = User.from(4, 'Nevdi', 'nevdi@nomail.com');
    let arealcutie = User.from(5, 'ARealCutie', 'arealcutie@nomail.com');

    let developmentUsers:User[] = [zoasty, zeni, oatsngoats, eddie, nevdi, arealcutie];

    developmentUsers.forEach((user, index, array) => {

      user.isMockAccount = false;
      user.shortDescription = `A Short Description of ${user.name}`;
      user.longDescription = this.fillLoremIpsumShort();
      user.pictureUrl = 'user/' + user.name.toLowerCase() + '.png';   // CASE SENSITIVE (?!)
      user.email = user.name + "@nomail.com";
      user.roleInfo = UserRole.from(UserRoleType.Editor, PersonRoleType.BoardMember);
      user.userRole = UserRoleType.Editor;
      user.personRole = PersonRoleType.BoardMember;

      users.push(user);
    });

    let aniv = User.from(6, 'AnivSmEsports', 'aniv-sm-esports@nomail.com');

    aniv.pictureUrl = 'user/aniv.png';
    aniv.shortDescription = 'i am aniv!';
    aniv.longDescription = 'Hey Evenyone! I am aniv! Thanks for joining me at this celebratory inaugural test-edition of Super Metroid Esports! (#freeaniv)';
    aniv.isMockAccount = false;
    aniv.roleInfo = UserRole.from(UserRoleType.Admin, PersonRoleType.GeneralUser);

    users.push(aniv);

    // User Credentials - (using 'test' as password for every test user)
    //
    users.forEach((user: User) => {
      this.credentials.push(UserCredentials.fromLogon(user.name, 'test'));
    });

    // User Mock Account(s):  (Using: unique-names-generator)
    const config: Config = {
      dictionaries: [names]
    }

    for (let index:number = 0; index < 1000; index++ ) {

      let uniqueName: string = uniqueNamesGenerator(config);
      let user:User = User.from(-1, uniqueName, uniqueName + "@nomail.com");

      user.id = index + users.length;
      user.isMockAccount = true;
      user.shortDescription = `A Short Description of ${user.name}`;
      user.longDescription = this.fillLoremIpsumShort();
      user.roleInfo = UserRole.from(UserRoleType.General, PersonRoleType.GeneralUser);
      user.userRole = UserRoleType.General;
      user.personRole = PersonRoleType.GeneralUser;

      users.push(user);
    }

    // Chat Rooms
    let chatPolitics = ChatRoom.from(0,
      'Politics',
      'Chat freely about politics! As, it is your first ammendment right!',
      'politics',
      'Please be respectful to others. How would you want to be treated?');

    let chatPeople = ChatRoom.from(1,
      'People',
      'Come and engage with us, about people and public outreach!',
      'people',
      'Please be respectful to others. How would you want to be treated?');

    let chatSpeedRunning = ChatRoom.from(2,
      'SM Speed Running',
      'This chat room is dedicated to the topic of SM Speed Running',
      'speed-running',
      'Please be respectful to others. How would you want to be treated?');

    let chatGeneral = ChatRoom.from(3,
      'General',
      'This chat room is for general chatting. Come share with us!',
      'general',
      'Please be respectful to others. How would you want to be treated?');

    chatRooms.push(chatPolitics);
    chatRooms.push(chatPeople);
    chatRooms.push(chatSpeedRunning);
    chatRooms.push(chatGeneral);

    // News
    let newsWelcome = Article.from(0,
      'Welcome to Super Metroid Esports!',
      'The site dedicated as a community backbone for Super Metroid Esports',
      'Please see our <span class="highlight link">Statement of Purpose</span> for more details!',
      '',
      BannerLinkType.None,
      '',
      new Date());

    let newsGDQ = new Article();

    newsGDQ.id = 1;
    newsGDQ.date = new Date();
    newsGDQ.bannerLinkYoutubeSourceId = "ckKkywPtHAQ";
    newsGDQ.bannerLinkType = BannerLinkType.YoutubeVideo;
    newsGDQ.description = 'From Left to Right:  Eddie, Imyt, Andy, and Oatsngoats giving it their all at GDQ! Save the Animals!';
    newsGDQ.title = 'Super Metroid by Andy, Oatsngoats, imyt and Eddie in 1:19:50';
    newsGDQ.bodyHtml = "<p>This speedrun was recorded during Awesome Games Done Quick 2025, a week long charity speedrun marathon raising money for the Prevent Cancer Foundation. Awesome Games Done Quick 2025 is just one of the many charity marathons organized by Games Done Quick. For more information on Awesome Games Done Quick 2025, find us at: <a>https://gamesdonequick.com/</a></p>";

    let newsGDQZoasty = new Article();

    newsGDQZoasty.id = 2;
    newsGDQZoasty.date = new Date();
    newsGDQZoasty.title = 'Super Metroid - SPEED RUN in 1:19:55 (100%) by zoast';
    newsGDQZoasty.bannerLinkYoutubeSourceId = "ZHw9I15HVrU";
    newsGDQZoasty.bannerLinkType = BannerLinkType.YoutubeVideo;
    newsGDQZoasty.description = 'Look at the crowd for this one!! Run starts at 04:00. Game #70, runner is zoast, check out his channel here (zoasty link)';
    newsGDQZoasty.bodyHtml = "<p>Captured live during SDA's Summer Games Done Quick 2013 in which $255,160.62 in over 10000 individual donations to Doctors without Borders was raised (as of August 1st), making this the first time the $1,000,000 mark has been reached and surpassed for money raised by SDA charity marathons (in total across all marathons)!!!! A huge thanks to everyone who donated, the SDA community and all those who worked tirelessly to make the marathon another success. Here's to #AGDQ14:) \n" +
      "\n" +
      "Released in April 1994, Super Metroid was the eagerly anticipated third game in the Metroid series. Samus Aran returns to the planet Zebes to once again fight the space pirates and Mother Brain who have taken the metroid hatchling.</p>";

    news.push(newsWelcome);
    news.push(newsGDQ);
    news.push(newsGDQZoasty);

    // MOCK CHAT DATA
    chatRooms.forEach(chatRoom => {
      chatRoom.chats.push(Chat.from(0, 'AnivSmEsports', this.helloMessage()));
    });


    // FILES
    fs.readdir(this.publicFolder, (error, dirFiles) => {

      if (error){
        console.log(error);
      }
      else{
        let index = 0;
        dirFiles.forEach((item) => {
          files.push(FileModel.from(index++, item, this.publicFolder));
        });
      }

    });

    // ~REPOSITORY INITIALIZE!~
    this.chatRooms.fullInitialize(chatRooms, SearchModel.default());
    this.users.fullInitialize(users, SearchModel.default());
    this.files.fullInitialize(files, SearchModel.default());
    this.news.fullInitialize(news, SearchModel.default());
  }

  helloMessage() {
    return "Hello! This is Aniv from SM Esports. Please enjoy chatting respectfully."
  }

  fillLoremIpsumShort() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget felis vitae nisi ornare porttitor et sed tellus. Vestibulum accumsan egestas leo, nec lobortis justo varius suscipit. Quisque aliquet eros mauris, vel ornare enim finibus eu. Sed nec nibh venenatis, vulputate nisl in, congue ex. Vestibulum vel est a eros elementum facilisis. Sed rhoncus leo sed erat imperdiet, sit amet volutpat dolor euismod. Nullam sollicitudin finibus urna ut vehicula. Cras ac mauris ut neque egestas vulputate vitae sit amet quam. Maecenas laoreet, ipsum at aliquam malesuada, metus ante blandit arcu, a feugiat nisi magna dignissim lacus. Fusce nec arcu erat. Maecenas posuere felis in lacus congue facilisis. Duis laoreet metus turpis. Praesent in maximus sem. Quisque sit amet nunc eget ligula scelerisque cursus sed id felis.";
  }

  fillLoremIpsumLong() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget felis vitae nisi ornare porttitor et sed tellus. Vestibulum accumsan egestas leo, nec lobortis justo varius suscipit. Quisque aliquet eros mauris, vel ornare enim finibus eu. Sed nec nibh venenatis, vulputate nisl in, congue ex. Vestibulum vel est a eros elementum facilisis. Sed rhoncus leo sed erat imperdiet, sit amet volutpat dolor euismod. Nullam sollicitudin finibus urna ut vehicula. Cras ac mauris ut neque egestas vulputate vitae sit amet quam. Maecenas laoreet, ipsum at aliquam malesuada, metus ante blandit arcu, a feugiat nisi magna dignissim lacus. Fusce nec arcu erat. Maecenas posuere felis in lacus congue facilisis. Duis laoreet metus turpis. Praesent in maximus sem. Quisque sit amet nunc eget ligula scelerisque cursus sed id felis.\n" +
      "\n" +
      "Integer aliquam, sapien at sollicitudin porttitor, tortor tortor consectetur justo, at sagittis orci ligula eu ipsum. Curabitur sit amet vulputate nulla, vitae luctus elit. Ut molestie justo eget finibus tempor. Praesent nisl orci, lacinia id libero a, maximus consectetur velit. Fusce cursus tempor purus vitae ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut non suscipit quam. Fusce porttitor condimentum orci nec porta. Aliquam erat volutpat.\n" +
      "\n" +
      "Aenean et odio ut libero auctor sagittis id quis mauris. Curabitur vehicula augue a sapien tincidunt consequat. Quisque iaculis facilisis auctor. Nulla aliquam lobortis libero iaculis ultrices. Donec a enim aliquet, pellentesque libero sit amet, laoreet massa. Aenean vel dictum elit, blandit blandit risus. In hac habitasse platea dictumst. Cras enim elit, rutrum ut lectus consectetur, placerat placerat purus.\n" +
      "\n" +
      "Sed ac aliquet lorem. Vivamus mollis dolor sit amet ornare tempus. Donec euismod purus et neque scelerisque suscipit. Morbi nulla quam, consequat sit amet sodales id, gravida sit amet nunc. Cras vitae eros eget leo eleifend luctus ullamcorper vel eros. Aliquam porttitor aliquam ipsum sit amet facilisis. Fusce mattis volutpat eros, ut laoreet massa lobortis eget. Curabitur malesuada gravida sapien. Donec laoreet porta nibh, ut commodo elit tristique quis. Fusce vel dui urna. Morbi feugiat, metus ut eleifend facilisis, dolor magna semper velit, eu eleifend urna lorem vel enim. Sed erat tortor, gravida nec nisi et, varius mattis dolor.\n" +
      "\n" +
      "Maecenas pharetra enim sed lectus fringilla sagittis. Nulla mollis mauris vitae mi feugiat aliquam. Fusce rhoncus dolor vitae risus varius, eget egestas sapien condimentum. Maecenas quis metus porttitor, tristique leo id, elementum sapien. Mauris interdum justo sed arcu porta, eu accumsan ante accumsan. Cras gravida consequat erat nec laoreet. Duis aliquam, nisl eu pellentesque maximus, sem purus blandit elit, id pulvinar justo erat eleifend libero. Nunc auctor ac neque non porta. Nunc id venenatis leo, sit amet varius magna. Donec semper urna nulla, quis vehicula quam varius ac. Donec laoreet porttitor tincidunt. Sed hendrerit tempor libero, vitae semper eros tincidunt eget. ";
  }

  fillText(from:number, to:number) {
    return this.fillWords(randomInt(from, to));
  }

  fillWords(wordNumber: number) {
    let result = '';

    for (let i = 0; i < wordNumber; i++) {
      result += this.fillChars() + ' ';
    }

    return result;
  }

  fillChars() {
    let length = randomInt(3, 15);
    let result = '';

    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(this.fillChar());
    }

    return result;
  }


  fillChar() {
    return randomInt(97, 122);
  }
}
