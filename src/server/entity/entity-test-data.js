"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityTestData = void 0;
var unique_names_generator_1 = require("unique-names-generator");
var User_1 = require("./model/User");
var UserCredential_1 = require("./model/UserCredential");
var Article_1 = require("./model/Article");
var ChatGroup_1 = require("./model/ChatGroup");
var ChatCategory_1 = require("./model/ChatCategory");
var ChatCategoryGroupMap_1 = require("./model/ChatCategoryGroupMap");
var ChatRoom_1 = require("./model/ChatRoom");
var ChatGroupRoomMap_1 = require("./model/ChatGroupRoomMap");
var EntityTestData = /** @class */ (function () {
    function EntityTestData() {
    }
    EntityTestData.create = function (controller) {
        return __awaiter(this, void 0, void 0, function () {
            var developmentUsers, mockUsers, config, index, newsWelcome, newsGDQ, newsGDQZoasty, chatCategories, chatGeneralGroups, chatBoardGroups, chatCategoryGeneral, chatCategoryBoard, chatCategoryPersonal, chatPolitics, chatPeople, chatSpeedRunning, chatGeneral, chatGeneralBoard, chatMedia, chatSecurity, chatCategoryGroupMaps;
            var _this = this;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                developmentUsers = ['zoasty', 'zeni', 'oatsngoats', 'eddie', 'nevdi', 'arealcutie', 'AnivSmEsports'];
                mockUsers = [];
                config = {
                    dictionaries: [unique_names_generator_1.names]
                };
                for (index = 0; index < 1000; index++) {
                    mockUsers.push((0, unique_names_generator_1.uniqueNamesGenerator)(config));
                }
                developmentUsers.concat(mockUsers).forEach(function (userName) {
                    var _a;
                    var user = new User_1.User();
                    var mockUser = mockUsers.some(function (x) { return x === userName; });
                    user.Name = userName;
                    user.ShortDescription = "A Short Description of ".concat(user.Name);
                    user.LongDescription = EntityTestData.fillLoremIpsumShort();
                    user.PictureUrl = 'user/' + user.Name.toLowerCase() + '.png'; // CASE SENSITIVE (?!)
                    user.Email = user.Name + "@nomail.com";
                    user.UserRoleId = mockUser ? 0 : 1; // General : Editor
                    user.PersonRoleId = mockUser ? 0 : 1; // General : Board
                    user.CreatedDate = new Date();
                    (_a = controller.users.append(user)) === null || _a === void 0 ? void 0 : _a.then(function (value) {
                        console.log("User (added):  ", value);
                    }, function (reason) {
                        console.log(reason);
                    });
                });
                // User Credentials - (using 'test' as password for every test user)
                //
                developmentUsers.forEach(function (userName) {
                    controller.users.getAll().then(function (users) {
                        users.forEach(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var entity, credentials;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        entity = user;
                                        credentials = new UserCredential_1.UserCredential();
                                        credentials.UserId = entity.Id;
                                        credentials.Password = 'test';
                                        return [4 /*yield*/, ((_a = controller.userCredentials.append(credentials)) === null || _a === void 0 ? void 0 : _a.then(function (value) {
                                                console.log("User Credentials (added):  ", value);
                                            }, function (error) {
                                                console.log(error);
                                            }))];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    }, function (error) {
                        console.log(error);
                    });
                });
                newsWelcome = new Article_1.Article();
                newsGDQ = new Article_1.Article();
                newsGDQZoasty = new Article_1.Article();
                newsWelcome.UserId = 0;
                newsWelcome.Date = new Date();
                newsWelcome.Title = 'Welcome to Super Metroid Esports!';
                newsWelcome.Description = 'The site dedicated as a community backbone for Super Metroid Esports';
                newsWelcome.BannerLinkTypeId = 0; // None
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
                (_a = controller.articles.appendMany([newsWelcome, newsGDQ, newsGDQZoasty])) === null || _a === void 0 ? void 0 : _a.then(function (result) {
                    console.log("Articles (added)", result);
                }).catch(function (err) {
                    console.log(err);
                });
                chatCategories = [];
                chatGeneralGroups = [];
                chatBoardGroups = [];
                chatCategoryGeneral = new ChatCategory_1.ChatCategory();
                chatCategoryBoard = new ChatCategory_1.ChatCategory();
                chatCategoryPersonal = new ChatCategory_1.ChatCategory();
                chatCategoryGeneral.Name = 'General';
                chatCategoryGeneral.Description = 'Public chat open to all users. Must be logged in to chat.';
                chatCategoryBoard.Name = 'Board';
                chatCategoryBoard.Description = 'Board member chat group. Must be logged in as a board member to chat.';
                chatCategoryPersonal.Name = 'Personal';
                chatCategoryPersonal.Description = 'Chat rooms for groups that I am currently a member of.';
                (_b = controller
                    .chatCategories
                    .appendMany([chatCategoryGeneral, chatCategoryBoard, chatCategoryPersonal])) === null || _b === void 0 ? void 0 : _b.then(function (result) {
                    console.log("Chat Categories (added):  ", result);
                    chatCategories = result;
                }).catch(function (err) {
                    console.log(err);
                });
                chatPolitics = new ChatGroup_1.ChatGroup();
                chatPeople = new ChatGroup_1.ChatGroup();
                chatSpeedRunning = new ChatGroup_1.ChatGroup();
                chatGeneral = new ChatGroup_1.ChatGroup();
                chatPolitics.Name = 'Politics';
                chatPolitics.Description = 'Chat freely about politics! As, it is your first ammendment right!';
                chatPeople.Name = 'People';
                chatPeople.Description = 'Come and engage with us, about people and public outreach!';
                chatSpeedRunning.Name = 'Speed Running';
                chatSpeedRunning.Description = 'This chat room is dedicated to the topic of SM Speed Running';
                chatGeneral.Name = 'General';
                chatGeneral.Description = 'This chat room is for general chatting. Come share with us!';
                (_c = controller.chatGroups.appendMany([chatPolitics, chatPeople, chatSpeedRunning, chatGeneral])) === null || _c === void 0 ? void 0 : _c.then(function (result) {
                    console.log("Chat Groups (added)", result);
                    chatGeneralGroups = result;
                }).catch(function (err) {
                    console.log(err);
                });
                chatGeneralBoard = new ChatGroup_1.ChatGroup();
                chatMedia = new ChatGroup_1.ChatGroup();
                chatSecurity = new ChatGroup_1.ChatGroup();
                chatGeneralBoard.Name = 'General';
                chatGeneralBoard.Description = 'General Board Chat';
                chatMedia.Name = 'Media';
                chatMedia.Description = 'Board discussion about media affairs';
                chatSecurity.Name = 'Security';
                chatSecurity.Description = 'Security related matters';
                (_d = controller.chatGroups.appendMany([chatGeneralBoard, chatMedia, chatSecurity])) === null || _d === void 0 ? void 0 : _d.then(function (result) {
                    console.log("Chat Groups (added)", result);
                    chatBoardGroups = result;
                }).catch(function (err) {
                    console.log(err);
                });
                chatCategoryGroupMaps = [];
                chatCategories.forEach(function (category) {
                    if (category.Name === chatCategoryGeneral.Name) {
                        chatGeneralGroups.forEach(function (group) {
                            var map = new ChatCategoryGroupMap_1.ChatCategoryGroupMap();
                            map.ChatCategoryId = category.Id;
                            map.ChatGroupId = group.Id;
                            chatCategoryGroupMaps.push(map);
                        });
                    }
                    else if (category.Name === chatCategoryBoard.Name) {
                        chatBoardGroups.forEach(function (group) {
                            var map = new ChatCategoryGroupMap_1.ChatCategoryGroupMap();
                            map.ChatCategoryId = category.Id;
                            map.ChatGroupId = group.Id;
                            chatCategoryGroupMaps.push(map);
                        });
                    }
                    else {
                        console.log("ERROR:  Improper data creation - chat associations not properly setup");
                    }
                });
                (_e = controller
                    .chatCategoryGroupMaps
                    .appendMany(chatCategoryGroupMaps)) === null || _e === void 0 ? void 0 : _e.then(function (result) {
                    console.log("Chat Category Group Maps (added)", result);
                    chatCategoryGroupMaps = result;
                }).catch(function (err) {
                    console.log(err);
                });
                // Chat Rooms (just put one per group for now)
                chatGeneralGroups.concat(chatBoardGroups).forEach(function (group) {
                    var _a;
                    var chatRoom = new ChatRoom_1.ChatRoom();
                    chatRoom.Name = '(default room)';
                    chatRoom.Description = 'Chat room for ' + group.Name;
                    (_a = controller.chatRooms.append(chatRoom)) === null || _a === void 0 ? void 0 : _a.then(function (result) {
                        var _a;
                        console.log("Chat Room (added)", result);
                        // Chat Group Room Map (association)
                        var map = new ChatGroupRoomMap_1.ChatGroupRoomMap();
                        map.ChatGroupId = group.Id;
                        map.ChatRoomId = result.Id;
                        // Append
                        (_a = controller.chatGroupRoomMaps.append(map)) === null || _a === void 0 ? void 0 : _a.then(function (result) {
                            console.log("Chat Group Room Map (added)", result);
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }).catch(function (err) {
                        console.log(err);
                    });
                });
                console.log("Server Data Model Initialized!");
                return [2 /*return*/];
            });
        });
    };
    EntityTestData.helloMessage = function () {
        return "Hello! This is Aniv from SM Esports. Please enjoy chatting respectfully.";
    };
    EntityTestData.fillLoremIpsumShort = function () {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget felis vitae nisi ornare porttitor et sed tellus. Vestibulum accumsan egestas leo, nec lobortis justo varius suscipit. Quisque aliquet eros mauris, vel ornare enim finibus eu. Sed nec nibh venenatis, vulputate nisl in, congue ex. Vestibulum vel est a eros elementum facilisis. Sed rhoncus leo sed erat imperdiet, sit amet volutpat dolor euismod. Nullam sollicitudin finibus urna ut vehicula. Cras ac mauris ut neque egestas vulputate vitae sit amet quam. Maecenas laoreet, ipsum at aliquam malesuada, metus ante blandit arcu, a feugiat nisi magna dignissim lacus. Fusce nec arcu erat. Maecenas posuere felis in lacus congue facilisis. Duis laoreet metus turpis. Praesent in maximus sem. Quisque sit amet nunc eget ligula scelerisque cursus sed id felis.";
    };
    EntityTestData.fillLoremIpsumLong = function () {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget felis vitae nisi ornare porttitor et sed tellus. Vestibulum accumsan egestas leo, nec lobortis justo varius suscipit. Quisque aliquet eros mauris, vel ornare enim finibus eu. Sed nec nibh venenatis, vulputate nisl in, congue ex. Vestibulum vel est a eros elementum facilisis. Sed rhoncus leo sed erat imperdiet, sit amet volutpat dolor euismod. Nullam sollicitudin finibus urna ut vehicula. Cras ac mauris ut neque egestas vulputate vitae sit amet quam. Maecenas laoreet, ipsum at aliquam malesuada, metus ante blandit arcu, a feugiat nisi magna dignissim lacus. Fusce nec arcu erat. Maecenas posuere felis in lacus congue facilisis. Duis laoreet metus turpis. Praesent in maximus sem. Quisque sit amet nunc eget ligula scelerisque cursus sed id felis.\n" +
            "\n" +
            "Integer aliquam, sapien at sollicitudin porttitor, tortor tortor consectetur justo, at sagittis orci ligula eu ipsum. Curabitur sit amet vulputate nulla, vitae luctus elit. Ut molestie justo eget finibus tempor. Praesent nisl orci, lacinia id libero a, maximus consectetur velit. Fusce cursus tempor purus vitae ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut non suscipit quam. Fusce porttitor condimentum orci nec porta. Aliquam erat volutpat.\n" +
            "\n" +
            "Aenean et odio ut libero auctor sagittis id quis mauris. Curabitur vehicula augue a sapien tincidunt consequat. Quisque iaculis facilisis auctor. Nulla aliquam lobortis libero iaculis ultrices. Donec a enim aliquet, pellentesque libero sit amet, laoreet massa. Aenean vel dictum elit, blandit blandit risus. In hac habitasse platea dictumst. Cras enim elit, rutrum ut lectus consectetur, placerat placerat purus.\n" +
            "\n" +
            "Sed ac aliquet lorem. Vivamus mollis dolor sit amet ornare tempus. Donec euismod purus et neque scelerisque suscipit. Morbi nulla quam, consequat sit amet sodales id, gravida sit amet nunc. Cras vitae eros eget leo eleifend luctus ullamcorper vel eros. Aliquam porttitor aliquam ipsum sit amet facilisis. Fusce mattis volutpat eros, ut laoreet massa lobortis eget. Curabitur malesuada gravida sapien. Donec laoreet porta nibh, ut commodo elit tristique quis. Fusce vel dui urna. Morbi feugiat, metus ut eleifend facilisis, dolor magna semper velit, eu eleifend urna lorem vel enim. Sed erat tortor, gravida nec nisi et, varius mattis dolor.\n" +
            "\n" +
            "Maecenas pharetra enim sed lectus fringilla sagittis. Nulla mollis mauris vitae mi feugiat aliquam. Fusce rhoncus dolor vitae risus varius, eget egestas sapien condimentum. Maecenas quis metus porttitor, tristique leo id, elementum sapien. Mauris interdum justo sed arcu porta, eu accumsan ante accumsan. Cras gravida consequat erat nec laoreet. Duis aliquam, nisl eu pellentesque maximus, sem purus blandit elit, id pulvinar justo erat eleifend libero. Nunc auctor ac neque non porta. Nunc id venenatis leo, sit amet varius magna. Donec semper urna nulla, quis vehicula quam varius ac. Donec laoreet porttitor tincidunt. Sed hendrerit tempor libero, vitae semper eros tincidunt eget. ";
    };
    return EntityTestData;
}());
exports.EntityTestData = EntityTestData;
