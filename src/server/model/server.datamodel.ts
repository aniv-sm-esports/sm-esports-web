import {PersonRoleType, User, UserRole, UserRoleType} from '../../app/model/repository/entity/user.model';
import {Article, BannerLinkType} from '../../app/model/repository/entity/article.model';
import {ChatRoom} from '../../app/model/repository/entity/chat-room.model';
import {Chat} from '../../app/model/repository/entity/chat.model';
import {ChatRoomUserMap} from '../../app/model/repository/entity/chat-room-user-map.model';
import {Injectable} from '@angular/core';
import {randomInt} from 'node:crypto';
import {UserCredentials, UserJWTPayload} from '../../app/model/service/user-logon.model';
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import {FileModel} from '../../app/model/repository/entity/file.model';
import * as fs from 'node:fs';
import { SearchModel } from '../../app/model/repository/search.model';
import {RepositoryServer} from '../../app/model/repository/repository-server.model';
import moment from 'moment';
import { ChatGroup } from '../../app/model/repository/entity/chat-group.model';
import { ChatGroupRoomMap } from '../../app/model/repository/entity/chat-group-room-map.model';
import { ChatCategory } from '../../app/model/repository/entity/chat-category.model';
import { ChatCategoryGroupMap } from '../../app/model/repository/entity/chat-category-group-map.model';

@Injectable({
  providedIn: 'root'
})
export class DataModel {

  public readonly publicFolder: string = 'public';

  credentials: UserCredentials[];
  chatRoomUserMap: ChatRoomUserMap;
  chatRooms: RepositoryServer<ChatRoom>;
  chatGroups: RepositoryServer<ChatGroup>;
  chatGroupRoomMaps: RepositoryServer<ChatGroupRoomMap>;
  chatCategories: RepositoryServer<ChatCategory>;
  chatCategoryGroupMaps: RepositoryServer<ChatCategoryGroupMap>;
  users: RepositoryServer<User>;
  news: RepositoryServer<Article>;
  files: RepositoryServer<FileModel>;

  // Auth Service (this may move to separate auth server)
  userTokenMap: Map<string, string>;
  tokenMap: Map<string, UserJWTPayload>;

  constructor() {

    // TODO: NEED SHARED CONFIG FOR THESE; OR SOME SHARED SERVICE FOR NAMING REPOSITORIES!
    //
    // There are dynamically created repositories. So, there must be a shared service
    // to provide names. A configuration GET seems like a "solution". So, probably best
    // to see what others have done.. /api/config/get .. sharedConfig: { ... }
    //

    this.chatRooms = new RepositoryServer<ChatRoom>('ChatRoom','ChatRoom', new SearchModel<ChatRoom>(ChatRoom.default(), []), [], true);
    this.chatGroups = new RepositoryServer<ChatGroup>('ChatGroup','ChatGroup', new SearchModel<ChatGroup>(ChatGroup.default(), []), [], true);
    this.chatGroupRoomMaps = new RepositoryServer<ChatGroupRoomMap>('ChatGroupRoomMap','ChatGroupRoomMap', new SearchModel<ChatGroupRoomMap>(ChatGroupRoomMap.default(), []), [], true);
    this.chatCategories = new RepositoryServer<ChatCategory>('ChatCategory','ChatCategory', new SearchModel<ChatCategory>(ChatCategory.default(), []), [], true);
    this.chatCategoryGroupMaps = new RepositoryServer<ChatCategoryGroupMap>('ChatCategoryGroupMap','ChatCategoryGroupMap', new SearchModel<ChatCategoryGroupMap>(ChatCategoryGroupMap.default(), []), [], true);
    this.users = new RepositoryServer<User>('User', 'User', new SearchModel<User>(User.default(), []), [], true);
    this.chatRoomUserMap = new ChatRoomUserMap();
    this.credentials = [];
    this.files = new RepositoryServer<FileModel>('File', 'File', new SearchModel<FileModel>(FileModel.default(), []), [], true);
    this.news = new RepositoryServer<Article>('Article', 'Article', new SearchModel<Article>(Article.default(), []), [], true);
    this.userTokenMap = new Map<string, string>();
    this.tokenMap = new Map<string, UserJWTPayload>();

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
      user.userRole = UserRoleType.Editor;
      user.personRole = PersonRoleType.BoardMember;

      this.users.append(user, true, false);
    });

    let aniv = User.from(6, 'AnivSmEsports', 'aniv-sm-esports@nomail.com');

    aniv.pictureUrl = 'user/aniv.png';
    aniv.shortDescription = 'i am aniv!';
    aniv.longDescription = 'Hey Evenyone! I am aniv! Thanks for joining me at this celebratory inaugural test-edition of Super Metroid Esports! (#freeaniv)';
    aniv.isMockAccount = false;

    this.users.append(aniv, true, false);

    // User Credentials - (using 'test' as password for every test user)
    //
    this.users.forEach((user: User) => {
      this.credentials.push(UserCredentials.fromLogon(user.name, 'test'));
    });

    // User Mock Account(s):  (Using: unique-names-generator)
    const config: Config = {
      dictionaries: [names]
    }

    for (let index:number = 0; index < 1000; index++ ) {

      let uniqueName: string = uniqueNamesGenerator(config);
      let user:User = User.from(-1, uniqueName, uniqueName + "@nomail.com");

      user.isMockAccount = true;
      user.shortDescription = `A Short Description of ${user.name}`;
      user.longDescription = this.fillLoremIpsumShort();
      user.userRole = UserRoleType.General;
      user.personRole = PersonRoleType.GeneralUser;

      this.users.append(user, true, false);
    }

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

    this.news.append(newsWelcome, true, false);
    this.news.append(newsGDQ, true, false);
    this.news.append(newsGDQZoasty, true, false);

    // FILES
    fs.readdir(this.publicFolder, (error, dirFiles) => {

      if (error){
        console.log(error);
      }
      else{
        let index = 0;
        dirFiles.forEach((item) => {
          this.files.append(FileModel.from(index++, item, this.publicFolder), true, false);
        });
      }

    });

    // Chat:
    //
    // - Category:     General, Board, Personal (Groups you set up)
    // - Group:        M groups per category
    // - Room:         N rooms per group
    // - Security:     TODO
    // - Chat:         ...
    //

    let chatCategoryGeneral = ChatGroup.from('General', 'Public chat open to all users. Must be logged in to chat.');
    let chatCategoryBoard = ChatGroup.from('Board', 'Board member chat group. Must be logged in as a board member to chat.');
    let chatCategoryPersonal = ChatGroup.from('Personal', 'Chat rooms for groups that I am currently a member of.');

    chatCategoryGeneral.id = 0;
    chatCategoryBoard.id = 1;
    chatCategoryPersonal.id = 2;

    this.chatCategories.append(chatCategoryGeneral, true, false);
    this.chatCategories.append(chatCategoryBoard, true, false);
    this.chatCategories.append(chatCategoryPersonal, true, false);

    // Category -> General
    let chatPolitics = ChatGroup.from('Politics', 'Chat freely about politics! As, it is your first ammendment right!');
    let chatPeople = ChatGroup.from('People', 'Come and engage with us, about people and public outreach!');
    let chatSpeedRunning = ChatGroup.from('Speed Running', 'This chat room is dedicated to the topic of SM Speed Running');
    let chatGeneral = ChatGroup.from('General', 'This chat room is for general chatting. Come share with us!');

    chatPolitics.id = 0;
    chatPeople.id = 1;
    chatSpeedRunning.id = 2;
    chatGeneral.id = 3;

    this.chatGroups.append(chatPolitics, true, false);
    this.chatGroups.append(chatPeople, true, false);
    this.chatGroups.append(chatSpeedRunning, true, false);
    this.chatGroups.append(chatGeneral, true, false);

    // Category -> Board
    let chatAll = ChatGroup.from('All', 'General Board Chat');
    let chatMedia = ChatGroup.from('Media', 'Board discussion about media affairs');
    let chatSecurity = ChatGroup.from('Speed Running', 'Security related matters');

    chatAll.id = 4;
    chatMedia.id = 5;
    chatSecurity.id = 6;

    this.chatGroups.append(chatAll, true,  false);
    this.chatGroups.append(chatMedia, true, false);
    this.chatGroups.append(chatSecurity, true, false);

    // Chat Map Associations
    this.chatCategoryGroupMaps.append(ChatCategoryGroupMap.from(0, chatCategoryGeneral.id, chatPolitics.id), true, false);
    this.chatCategoryGroupMaps.append(ChatCategoryGroupMap.from(1, chatCategoryGeneral.id, chatPeople.id), true, false);
    this.chatCategoryGroupMaps.append(ChatCategoryGroupMap.from(2, chatCategoryGeneral.id, chatSpeedRunning.id), true, false);
    this.chatCategoryGroupMaps.append(ChatCategoryGroupMap.from(3, chatCategoryGeneral.id, chatGeneral.id), true, false);

    this.chatCategoryGroupMaps.append(ChatCategoryGroupMap.from(4, chatCategoryBoard.id, chatAll.id), true, false);
    this.chatCategoryGroupMaps.append(ChatCategoryGroupMap.from(5, chatCategoryBoard.id, chatMedia.id), true, false);
    this.chatCategoryGroupMaps.append(ChatCategoryGroupMap.from(6, chatCategoryBoard.id, chatSecurity.id), true, false);

    // Chat Rooms (just put one per group for now)
    this.chatGroups.forEach(chatGroup => {

      // ChatRoom (default) (entity.id)
      let chatRoom = ChatRoom.from(0, chatGroup.name + " (default room)", "(default chat room)", '/', '');
      this.chatRooms.append(chatRoom, true, false);

      // ChatRoomGroupMap
      let chatRoomGroupMap = ChatGroupRoomMap.from(0, chatGroup.id, chatRoom.id);
      this.chatGroupRoomMaps.append(chatRoomGroupMap, true, false);
    });

    console.log(`Server Data Model Initialized:  Users(${this.users.getRecordCount()}), ChatRooms(${this.chatRooms.getRecordCount()}), News(${this.news.getRecordCount()}), Files(${this.files.getRecordCount()})`);
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
