import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import { EntityController } from './entity-controller';
import { User } from './model/User';
import { UserCredential } from './model/UserCredential';
import { Article } from './model/Article';
import { ChatGroup } from './model/ChatGroup';
import { ChatCategory } from './model/ChatCategory';
import { ChatCategoryGroupMap } from './model/ChatCategoryGroupMap';
import { ChatRoom } from './model/ChatRoom';
import {ChatGroupRoomMap} from './model/ChatGroupRoomMap';

export class EntityTestData {

  public static async create(controller:EntityController) {

    // Users
    let developmentUsers:string[] = ['zoasty', 'zeni', 'oatsngoats', 'eddie', 'nevdi', 'arealcutie', 'AnivSmEsports'];
    let mockUsers:string[] = [];

    // User Mock Account(s):  (Using: unique-names-generator)
    const config: Config = {
      dictionaries: [names]
    }

    for (let index:number = 0; index < 1000; index++ ) {
      mockUsers.push(uniqueNamesGenerator(config));
    }

    developmentUsers.concat(mockUsers).forEach((userName) => {

      let user = new User();
      let mockUser = mockUsers.some(x => x === userName);

      user.Name = userName;
      user.ShortDescription = `A Short Description of ${user.Name}`;
      user.LongDescription = EntityTestData.fillLoremIpsumShort();
      user.PictureUrl = 'user/' + user.Name.toLowerCase() + '.png';   // CASE SENSITIVE (?!)
      user.Email = user.Name + "@nomail.com";
      user.UserRoleId = mockUser ? 0 : 1;                              // General : Editor
      user.PersonRoleId = mockUser ? 0 : 1;                            // General : Board
      user.CreatedDate = new Date();

      controller.users.append(user)?.then(value => {
        console.log("User (added):  ", value);
      }, reason => {
        console.log(reason);
      });
    });

    // User Credentials - (using 'test' as password for every test user)
    //
    developmentUsers.forEach(userName => {
      controller.users.getAll().then(users => {
        users.forEach(async user => {

          let entity = user as User;
          let credentials = new UserCredential();
          credentials.UserId = entity.Id;
          credentials.Password = 'test';

          await controller.userCredentials.append(credentials)?.then(value => {
            console.log("User Credentials (added):  ", value);
          }, error => {
            console.log(error);
          });

        });
      }, error => {
        console.log(error);
      })
    });

    let newsWelcome = new Article();
    let newsGDQ = new Article();
    let newsGDQZoasty = new Article();

    newsWelcome.UserId = 0;
    newsWelcome.Date = new Date();
    newsWelcome.Title = 'Welcome to Super Metroid Esports!';
    newsWelcome.Description = 'The site dedicated as a community backbone for Super Metroid Esports';
    newsWelcome.BannerLinkTypeId = 0;             // None
    newsWelcome.BannerYoutubeSourceId = '';
    newsWelcome.Body = "Please see our <span class=\"highlight link\">Statement of Purpose</span> for more details!";


    newsGDQ.Date = new Date();
    newsGDQ.BannerYoutubeSourceId = "ckKkywPtHAQ";
    newsGDQ.BannerLinkTypeId = 2;
    newsGDQ.Description = 'From Left to Right:  Eddie, Imyt, Andy, and Oatsngoats giving it their all at GDQ! Save the Animals!';
    newsGDQ.Title = 'Super Metroid by Andy, Oatsngoats, imyt and Eddie in 1:19:50';
    newsGDQ.Body = "<p>This speedrun was recorded during Awesome Games Done Quick 2025, a week long charity speedrun marathon raising money for the Prevent Cancer Foundation. Awesome Games Done Quick 2025 is just one of the many charity marathons organized by Games Done Quick. For more information on Awesome Games Done Quick 2025, find us at: <a>https://gamesdonequick.com/</a></p>";

    newsGDQZoasty.Date = new Date();
    newsGDQZoasty.Title = 'Super Metroid - SPEED RUN in 1:19:55 (100%) by zoast';
    newsGDQZoasty.BannerYoutubeSourceId = "ZHw9I15HVrU";
    newsGDQZoasty.BannerLinkTypeId = 2;
    newsGDQZoasty.Description = 'Look at the crowd for this one!! Run starts at 04:00. Game #70, runner is zoast, check out his channel here (zoasty link)';
    newsGDQZoasty.Body = "<p>Captured live during SDA's Summer Games Done Quick 2013 in which $255,160.62 in over 10000 individual donations to Doctors without Borders was raised (as of August 1st), making this the first time the $1,000,000 mark has been reached and surpassed for money raised by SDA charity marathons (in total across all marathons)!!!! A huge thanks to everyone who donated, the SDA community and all those who worked tirelessly to make the marathon another success. Here's to #AGDQ14:) \n" +
      "\n" +
      "Released in April 1994, Super Metroid was the eagerly anticipated third game in the Metroid series. Samus Aran returns to the planet Zebes to once again fight the space pirates and Mother Brain who have taken the metroid hatchling.</p>";

    controller.articles.appendMany([newsWelcome, newsGDQ, newsGDQZoasty])?.then(result => {
      console.log("Articles (added)", result);
    }).catch(err => {
      console.log(err);
    });

    // Chat:
    //
    // - Category:     General, Board, Personal (Groups you set up)
    // - Group:        M groups per category
    // - Room:         N rooms per group
    // - Security:     TODO
    // - Chat:         ...
    //

    // Store results of inserts for use to create maps
    let chatCategories: ChatCategory[] = [];
    let chatGeneralGroups:ChatGroup[] = [];
    let chatBoardGroups:ChatGroup[] = [];

    let chatCategoryGeneral = new ChatCategory();
    let chatCategoryBoard = new ChatCategory();
    let chatCategoryPersonal = new ChatCategory();

    chatCategoryGeneral.Name = 'General';
    chatCategoryGeneral.Description = 'Public chat open to all users. Must be logged in to chat.';
    chatCategoryBoard.Name = 'Board';
    chatCategoryBoard.Description = 'Board member chat group. Must be logged in as a board member to chat.';
    chatCategoryPersonal.Name = 'Personal';
    chatCategoryPersonal.Description = 'Chat rooms for groups that I am currently a member of.';

    controller
      .chatCategories
      .appendMany([chatCategoryGeneral, chatCategoryBoard, chatCategoryPersonal])?.then(result => {
        console.log("Chat Categories (added):  ", result);
        chatCategories = result;
    }).catch(err => {
        console.log(err);
    });

    // Category -> General
    let chatPolitics = new ChatGroup();
    let chatPeople = new ChatGroup();
    let chatSpeedRunning = new ChatGroup();
    let chatGeneral = new ChatGroup();

    chatPolitics.Name = 'Politics';
    chatPolitics.Description = 'Chat freely about politics! As, it is your first ammendment right!';
    chatPeople.Name = 'People';
    chatPeople.Description = 'Come and engage with us, about people and public outreach!';
    chatSpeedRunning.Name = 'Speed Running';
    chatSpeedRunning.Description = 'This chat room is dedicated to the topic of SM Speed Running';
    chatGeneral.Name = 'General';
    chatGeneral.Description = 'This chat room is for general chatting. Come share with us!';

    controller.chatGroups.appendMany([chatPolitics, chatPeople, chatSpeedRunning, chatGeneral])?.then(result => {
      console.log("Chat Groups (added)", result);
      chatGeneralGroups = result;
    }).catch(err => {
      console.log(err);
    })

    // Category -> Board
    let chatGeneralBoard = new ChatGroup();
    let chatMedia = new ChatGroup();
    let chatSecurity = new ChatGroup();

    chatGeneralBoard.Name = 'General';
    chatGeneralBoard.Description = 'General Board Chat';
    chatMedia.Name = 'Media';
    chatMedia.Description = 'Board discussion about media affairs';
    chatSecurity.Name = 'Security';
    chatSecurity.Description = 'Security related matters';

    controller.chatGroups.appendMany([chatGeneralBoard, chatMedia, chatSecurity])?.then(result => {
      console.log("Chat Groups (added)", result);
      chatBoardGroups = result;
    }).catch(err => {
      console.log(err);
    })

    // Chat Map Associations
    let chatCategoryGroupMaps:ChatCategoryGroupMap[] = [];

    chatCategories.forEach(category => {
      if (category.Name === chatCategoryGeneral.Name) {
        chatGeneralGroups.forEach(group => {
          let map = new ChatCategoryGroupMap();
          map.ChatCategoryId = category.Id;
          map.ChatGroupId = group.Id;
          chatCategoryGroupMaps.push(map);
        });
      }
      else if(category.Name === chatCategoryBoard.Name) {
        chatBoardGroups.forEach(group => {
          let map = new ChatCategoryGroupMap();
          map.ChatCategoryId = category.Id;
          map.ChatGroupId = group.Id;
          chatCategoryGroupMaps.push(map);
        });
      }
      else {
        console.log("ERROR:  Improper data creation - chat associations not properly setup");
      }
    });

    controller
      .chatCategoryGroupMaps
      .appendMany(chatCategoryGroupMaps)
      ?.then(result => {
      console.log("Chat Category Group Maps (added)", result);
      chatCategoryGroupMaps = result;
    }).catch(err => {
      console.log(err);
    });

    // Chat Rooms (just put one per group for now)
    chatGeneralGroups.concat(chatBoardGroups).forEach(group => {
      let chatRoom = new ChatRoom();
      chatRoom.Name = '(default room)';
      chatRoom.Description = 'Chat room for ' + group.Name;

      controller.chatRooms.append(chatRoom)?.then(result => {
        console.log("Chat Room (added)", result);

        // Chat Group Room Map (association)
        let map = new ChatGroupRoomMap();
        map.ChatGroupId = group.Id;
        map.ChatRoomId = (result as ChatRoom).Id;

        // Append
        controller.chatGroupRoomMaps.append(map)?.then(result => {
          console.log("Chat Group Room Map (added)", result);
        }).catch(error => {
          console.log(error);
        })

      }).catch(err => {
        console.log(err);
      })
    });

    console.log("Server Data Model Initialized!");
  }

  public static helloMessage() {
    return "Hello! This is Aniv from SM Esports. Please enjoy chatting respectfully."
  }

  public static fillLoremIpsumShort() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget felis vitae nisi ornare porttitor et sed tellus. Vestibulum accumsan egestas leo, nec lobortis justo varius suscipit. Quisque aliquet eros mauris, vel ornare enim finibus eu. Sed nec nibh venenatis, vulputate nisl in, congue ex. Vestibulum vel est a eros elementum facilisis. Sed rhoncus leo sed erat imperdiet, sit amet volutpat dolor euismod. Nullam sollicitudin finibus urna ut vehicula. Cras ac mauris ut neque egestas vulputate vitae sit amet quam. Maecenas laoreet, ipsum at aliquam malesuada, metus ante blandit arcu, a feugiat nisi magna dignissim lacus. Fusce nec arcu erat. Maecenas posuere felis in lacus congue facilisis. Duis laoreet metus turpis. Praesent in maximus sem. Quisque sit amet nunc eget ligula scelerisque cursus sed id felis.";
  }

  public static fillLoremIpsumLong() {
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
}
