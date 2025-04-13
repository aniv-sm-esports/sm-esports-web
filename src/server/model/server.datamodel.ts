import {PersonRoleType, User, UserRole, UserRoleType} from '../../app/model/user.model';
import {BannerLinkType, Article} from '../../app/model/article.model';
import {ChatRoom} from '../../app/model/chat-room.model';
import {Chat} from '../../app/model/chat.model';
import {ChatRoomUserMap} from '../../app/model/chat-room-user-map.model';
import {Injectable} from '@angular/core';
import {randomInt} from 'node:crypto';
import {UserCredentials, UserJWT, UserJWTPayload} from '../../app/model/user-logon.model';
import {FileModel} from '../../app/model/file.model';
import * as fs from 'node:fs';

@Injectable({
  providedIn: 'root'
})
export class DataModel {

  public readonly publicFolder: string = 'public';

  chatRoomUserMap: ChatRoomUserMap;
  chatRooms: Map<number, ChatRoom>;
  users: Map<number, User>;
  news: Map<number, Article>;
  credentials: Map<number, UserCredentials>;
  files: FileModel[];

  // Auth Service (this may move to separate auth server)
  userTokenMap: Map<string, string>;
  tokenMap: Map<string, UserJWTPayload>;

  constructor() {

    this.users = new Map();
    this.news = new Map();
    this.chatRooms = new Map();
    this.chatRoomUserMap = new ChatRoomUserMap();
    this.credentials = new Map();
    this.files = [];
    this.userTokenMap = new Map<string, string>();
    this.tokenMap = new Map<string, UserJWTPayload>();

    // Server Application Defaults

    // Users
    let zoasty = User.from(0, 'zoasty', 'zoasty@nomail.com');
    let zeni = User.from(1, 'ShinyZeni', 'zeni@nomail.com');
    let oatsngoats = User.from(2, 'Oatsngoats', 'oatsngoats@nomail.com');
    let eddie = User.from(3, 'Eddie', 'eddie@nomail.com');
    let nevdi = User.from(4, 'Nevdi', 'nevdi@nomail.com');
    let arealcutie = User.from(5, 'ARealCutie', 'arealcutie@nomail.com');

    zoasty.shortDescription = 'A Short Description of Zoasty';
    zeni.shortDescription = 'A Short Description of ShinyZeni';
    oatsngoats.shortDescription = 'A Short Description of Oatsngoats';
    eddie.shortDescription = 'A Short Description of Eddie';
    nevdi.shortDescription = 'A Short Description of Nevdi';
    arealcutie.shortDescription = 'A Short Description of ARealCutie';

    zoasty.longDescription = this.fillLoremIpsumShort();
    zeni.longDescription = this.fillLoremIpsumShort();
    oatsngoats.longDescription = this.fillLoremIpsumShort();
    eddie.longDescription = this.fillLoremIpsumShort();
    nevdi.longDescription = this.fillLoremIpsumShort();
    arealcutie.longDescription = this.fillLoremIpsumShort();

    zoasty.pictureUrl = 'zoasty.png';
    zeni.pictureUrl = 'shinyzeni.png';
    oatsngoats.pictureUrl = 'oatsngoats.png';
    eddie.pictureUrl = 'eddie.png';
    nevdi.pictureUrl = 'nevdi.png';
    arealcutie.pictureUrl = 'arealcutie.png';

    zoasty.roleInfo = UserRole.from(UserRoleType.Editor, PersonRoleType.BoardMember);
    zeni.roleInfo = UserRole.from(UserRoleType.Editor, PersonRoleType.BoardMember);
    oatsngoats.roleInfo = UserRole.from(UserRoleType.Editor, PersonRoleType.BoardMember);
    eddie.roleInfo = UserRole.from(UserRoleType.Editor, PersonRoleType.BoardMember);
    nevdi.roleInfo = UserRole.from(UserRoleType.Editor, PersonRoleType.BoardMember);
    arealcutie.roleInfo = UserRole.from(UserRoleType.Editor, PersonRoleType.BoardMember);

    let aniv = User.from(6, 'AnivSmEsports', 'aniv-sm-esports@nomail.com');

    aniv.pictureUrl = 'aniv.png';
    aniv.shortDescription = 'i am aniv!';
    aniv.longDescription = 'Hey Evenyone! I am aniv! #freeaniv! Thanks for joining me at this celebratory inaugural test-edition of Super Metroid Esports!';
    aniv.roleInfo = UserRole.from(UserRoleType.Admin, PersonRoleType.GeneralUser);

    this.users.set(0, zoasty);
    this.users.set(1, zeni);
    this.users.set(2, oatsngoats);
    this.users.set(3, eddie);
    this.users.set(4, nevdi);
    this.users.set(5, arealcutie);
    this.users.set(6, aniv);

    // User Credentials - (using 'test' as password for every test user)
    //
    this.users.forEach((user: User) => {
      this.credentials.set(user.id, UserCredentials.fromLogon(user.name, 'test'));
    });

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

    this.chatRooms.set(0, chatPolitics);
    this.chatRooms.set(1, chatPeople);
    this.chatRooms.set(2, chatSpeedRunning);
    this.chatRooms.set(3, chatGeneral);

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

    this.news.set(0, newsWelcome);
    this.news.set(1, newsGDQ);
    this.news.set(2, newsGDQZoasty);

    // MOCK CHAT DATA
    this.chatRooms.forEach(chatRoom => {
      chatRoom.chats.push(Chat.from(0, 'AnivSmEsports', this.helloMessage()));
    });


    // FILES
    fs.readdir(this.publicFolder, (error, files) => {

      if (error){
        console.log(error);
      }
      else{
        files.forEach((item) => {
          this.files.push(FileModel.from(item, this.publicFolder));
        });
      }

    });
  }

  getUserByName(name: string, ignoreCase:boolean = false) {

    let result:User = User.default();

    this.users.forEach((user) => {

      if (!ignoreCase) {
        if(user.name == name) {
          result = user;
          return;
        }
      }
      else {
        if (user.name.toLowerCase() == name.toLowerCase()) {
          if(user.name == name) {
            result = user;
            return;
          }
        }
      }

    });

    return result;
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
