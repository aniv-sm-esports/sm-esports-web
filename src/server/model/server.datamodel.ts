import {PersonRoleType, User, UserRole, UserRoleType} from '../../app/model/user.model';
import {BannerLinkType, News} from '../../app/model/news.model';
import {ChatRoom} from '../../app/model/chat-room.model';
import {Chat} from '../../app/model/chat.model';
import {ChatRoomUserMap} from '../../app/model/chat-room-user-map.model';
import {Injectable} from '@angular/core';
import {randomInt} from 'node:crypto';

@Injectable({
  providedIn: 'root'
})
export class DataModel {

  chatRoomUserMap: ChatRoomUserMap;
  chatRooms: Map<number, ChatRoom>;
  users: Map<number, User>;
  news: Map<number, News>;

  constructor() {

    this.users = new Map();
    this.news = new Map();
    this.chatRooms = new Map();
    this.chatRoomUserMap = new ChatRoomUserMap();

    // Server Application Defaults

    // Users
    let zoasty = new User(0, 'zoasty');
    let zeni = new User(1, 'ShinyZeni');
    let oatsngoats = new User(2, 'Oatsngoats');
    let eddie = new User(3, 'Eddie');
    let nevdi = new User(4, 'Nevdi');
    let arealcutie = new User(5, 'ARealCutie');

    zoasty.shortDescription = 'A Short Description of Zoasty';
    zeni.shortDescription = 'A Short Description of ShinyZeni';
    oatsngoats.shortDescription = 'A Short Description of Oatsngoats';
    eddie.shortDescription = 'A Short Description of Eddie';
    nevdi.shortDescription = 'A Short Description of Nevdi';
    arealcutie.shortDescription = 'A Short Description of ARealCutie';

    zoasty.longDescription = this.fillText(100, 150);
    zeni.longDescription = this.fillText(100, 150);
    oatsngoats.longDescription = this.fillText(100, 150);
    eddie.longDescription = this.fillText(100, 150);
    nevdi.longDescription = this.fillText(100, 150);
    arealcutie.longDescription = this.fillText(100, 150);

    zoasty.email = 'zoasty@nomail.com';
    zeni.email = 'zeni@nomail.com';
    oatsngoats.email = 'oatsngoats@nomail.com';
    eddie.email = 'eddie@nomail.com';
    nevdi.email = 'nevdi@nomail.com';
    arealcutie.email = 'arealcutie@nomail.com';

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

    let aniv = new User(6, 'aniv-sm-esports');

    aniv.email = 'aniv-sm-esports@gmail.com';
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
    let newsWelcome = News.from(0,
      'Welcome to Super Metroid Esports!',
      'The site dedicated as a community backbone for Super Metroid Esports',
      'Please see our <span class="highlight link">Statement of Purpose</span> for more details!',
      '',
      BannerLinkType.None,
      '',
      new Date());

    let newsGDQ = new News();

    newsGDQ.id = 1;
    newsGDQ.date = new Date();
    newsGDQ.bannerLinkYoutubeSourceId = "ckKkywPtHAQ";
    newsGDQ.bannerLinkType = BannerLinkType.YoutubeVideo;
    newsGDQ.description = 'From Left to Right:  Eddie, Imyt, Andy, and Oatsngoats giving it their all at GDQ! Save the Animals!';
    newsGDQ.title = 'Super Metroid by Andy, Oatsngoats, imyt and Eddie in 1:19:50';
    newsGDQ.bodyHtml = "<p>Lorem ipsum dolor sit amet consectetur <span class=\'link highlight\'>adipiscing</span> elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>";

    this.news.set(0, newsWelcome);
    this.news.set(1, newsGDQ);

    // MOCK CHAT DATA
    for (let i = 0; i < 50; i++) {
      this.chatRooms.get(0)?.chats.push(Chat.from(i, 0, 'aniv-sm-esports', this.fillText(30, 50)));
    }
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
