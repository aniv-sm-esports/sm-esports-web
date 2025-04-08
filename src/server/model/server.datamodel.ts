import {PersonRoleType, User, UserRole, UserRoleType} from '../../app/model/user.model';
import {BannerLinkType, Article} from '../../app/model/article.model';
import {ChatRoom} from '../../app/model/chat-room.model';
import {Chat} from '../../app/model/chat.model';
import {ChatRoomUserMap} from '../../app/model/chat-room-user-map.model';
import {Injectable} from '@angular/core';
import {randomInt} from 'node:crypto';
import {UserCredentials} from '../../app/model/user-logon.model';
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

  constructor() {

    this.users = new Map();
    this.news = new Map();
    this.chatRooms = new Map();
    this.chatRoomUserMap = new ChatRoomUserMap();
    this.credentials = new Map();
    this.files = [];

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

    zoasty.longDescription = this.fillLoremIpsumShort();
    zeni.longDescription = this.fillLoremIpsumShort();
    oatsngoats.longDescription = this.fillLoremIpsumShort();
    eddie.longDescription = this.fillLoremIpsumShort();
    nevdi.longDescription = this.fillLoremIpsumShort();
    arealcutie.longDescription = this.fillLoremIpsumShort();

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
    newsGDQ.bodyHtml = "<p>Lorem ipsum dolor sit amet consectetur <span class=\'link highlight\'>adipiscing</span> elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>";

    this.news.set(0, newsWelcome);
    this.news.set(1, newsGDQ);

    // MOCK CHAT DATA
    for (let i = 0; i < 50; i++) {
      this.chatRooms.get(0)?.chats.push(Chat.from(i, 0, 'aniv-sm-esports', this.fillText(30, 50)));
    }

    // FILES
    fs.readdir(this.publicFolder, (error, files) => {

      if (error){
        console.log(error);
      }
      else{
        files.forEach((item) => {
          this.files.push(new FileModel(item, this.publicFolder));
        });
      }

    });
  }

  getUserByName(name: string) {

    let result:User = User.default();

    this.users.forEach((user) => {
      if(user.name == name) {
        result = user;
      }
    });

    return result;
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
