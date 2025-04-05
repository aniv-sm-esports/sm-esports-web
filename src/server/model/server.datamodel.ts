import {User} from '../../app/model/user.model';
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
    this.users.set(0, new User(0, 'aniv-sm-esports'));

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
      this.chatRooms.get(0)?.chats.push(Chat.from(i, 0, 'aniv-sm-esports', this.fillText()));
    }
  }

  fillText() {
    return this.fillWords(randomInt(5, 30));
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
