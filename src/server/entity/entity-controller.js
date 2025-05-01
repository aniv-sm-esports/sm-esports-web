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
exports.EntityController = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var Article_1 = require("./model/Article");
var PersonRoleType_1 = require("./model/PersonRoleType");
var File_1 = require("./model/File");
var ChatCategory_1 = require("./model/ChatCategory");
var ArticleBannerLinkType_1 = require("./model/ArticleBannerLinkType");
var Chat_1 = require("./model/Chat");
var ChatCategoryGroupMap_1 = require("./model/ChatCategoryGroupMap");
var ChatGroup_1 = require("./model/ChatGroup");
var ChatGroupRoomMap_1 = require("./model/ChatGroupRoomMap");
var ChatRoom_1 = require("./model/ChatRoom");
var ChatRoomChatMap_1 = require("./model/ChatRoomChatMap");
var ChatRoomSecurityRule_1 = require("./model/ChatRoomSecurityRule");
var ChatRoomUserMap_1 = require("./model/ChatRoomUserMap");
var User_1 = require("./model/User");
var UserRoleType_1 = require("./model/UserRoleType");
var entity_cache_search_1 = require("./entity-cache-search");
var UserCredential_1 = require("./model/UserCredential");
var TableChangedView_1 = require("./model/TableChangedView");
var UserJWT_1 = require("./model/UserJWT");
var entity_cache_server_1 = require("./entity-cache-server");
var entity_test_data_1 = require("./entity-test-data");
var EntityController = /** @class */ (function () {
    /*
  
    // Auth Service (this may move to separate auth server)
    userTokenMap: Map<string, string>;
    tokenMap: Map<string, UserJWTPayload>;
  */
    // Creates an instance of the server database using environment variable settings [USER, PASSWORD, HOST, DB])
    function EntityController(logger) {
        this.logger = logger;
        this.sequelize = new sequelize_typescript_1.Sequelize(process.env['DB'], process.env['DB_USER'], String(process.env['DB_PASSWORD']), {
            dialect: "postgres",
            host: process.env['HOST'],
            models: [
                Article_1.Article, // NOTE*** These are ModelCtor instances (new ():T => T)
                ArticleBannerLinkType_1.ArticleBannerLinkType,
                Chat_1.Chat,
                ChatCategory_1.ChatCategory,
                ChatCategoryGroupMap_1.ChatCategoryGroupMap,
                ChatGroup_1.ChatGroup,
                ChatGroupRoomMap_1.ChatGroupRoomMap,
                ChatRoom_1.ChatRoom,
                ChatRoomChatMap_1.ChatRoomChatMap,
                ChatRoomSecurityRule_1.ChatRoomSecurityRule,
                ChatRoomUserMap_1.ChatRoomUserMap,
                File_1.File,
                PersonRoleType_1.PersonRoleType,
                TableChangedView_1.TableChangedView,
                User_1.User,
                UserCredential_1.UserCredential,
                UserJWT_1.UserJWT,
                UserRoleType_1.UserRoleType
            ],
            schema: "public",
            query: {
                raw: true // NOTE!  The "non-raw" option doesn't map directly to an entity!
            },
            define: {
            /*
            defaultScope?: FindOptions<Attributes<M>>
            scopes?: ModelScopeOptions<Attributes<M>>
            omitNull?: boolean
            timestamps?: boolean
            paranoid?: boolean
            underscored?: boolean
            hasTrigger?: boolean
            freezeTableName?: boolean
            name?: ModelNameOptions
            modelName?: string
            indexes?: readonly ModelIndexesOptions[]
            createdAt?: string | boolean
            deletedAt?: string | boolean
            updatedAt?: string | boolean
            tableName?: string
            schema?: string
            engine?: string
            charset?: string
            comment?: string
            collate?: string
            initialAutoIncrement?: string
            hooks?: Partial<ModelHooks<M, Attributes<M>>>
            validate?: ModelValidateOptions
            setterMethods?: ModelSetterOptions<M>
            getterMethods?: ModelGetterOptions<M>
            version?: boolean | string
            whereMergeStrategy?: "and" | "overwrite
            */
            }
            /*
            dialect?: Dialect
            dialectModule?: object
            dialectModulePath?: string
            dialectOptions?: object
            storage?: string
            database?: string
            username?: string
            password?: string
            host?: string
            port?: number
            ssl?: boolean
            protocol?: string
            define?: ModelOptions
            query?: QueryOptions
            set?: DefaultSetOptions
            sync?: SyncOptions
            timezone?: string
            omitNull?: boolean
            native?: boolean
            replication?: ReplicationOptions | false
            pool?: PoolOptions
            quoteIdentifiers?: boolean
            isolationLevel?: string
            transactionType?: Transaction.TYPES
            typeValidation?: boolean
            operatorsAliases?: OperatorsAliases
            standardConformingStrings?: boolean
            clientMinMessages?: string | boolean
            hooks?: Partial<SequelizeHooks<Model, any, any>>
            minifyAliases?: boolean
            logQueryParameters?: boolean
            retry?: RetryOptions
            schema?: string
            attributeBehavior?: "escape" | "throw" | "unsafe-legacy"
            */
        });
        // Entity Caches:  Repository "Key" is just a unique string identifier. Chat repositories, for example, may be created at
        //                 runtime - based on the user's needs. Keep this to be the entity name if possible; and the pattern, simple.
        //
        this.articles = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'Article', 'Article', new entity_cache_search_1.EntityCacheSearch(new Article_1.Article(), []), true);
        this.articleBannerLinkTypes = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'ArticleBannerLinkType', 'ArticleBannerLinkType', new entity_cache_search_1.EntityCacheSearch(new ArticleBannerLinkType_1.ArticleBannerLinkType(), []), true);
        this.chats = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'Chat', 'Chat', new entity_cache_search_1.EntityCacheSearch(new Chat_1.Chat(), []), true);
        this.chatCategories = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'ChatCategory', 'ChatCategory', new entity_cache_search_1.EntityCacheSearch(new ChatCategory_1.ChatCategory(), []), true);
        this.chatCategoryGroupMaps = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'ChatCategoryGroupMap', 'ChatCategoryGroupMap', new entity_cache_search_1.EntityCacheSearch(new ChatCategoryGroupMap_1.ChatCategoryGroupMap(), []), true);
        this.chatGroups = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'ChatGroup', 'ChatGroup', new entity_cache_search_1.EntityCacheSearch(new ChatGroup_1.ChatGroup(), []), true);
        this.chatGroupRoomMaps = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'ChatGroupRoomMap', 'ChatGroupRoomMap', new entity_cache_search_1.EntityCacheSearch(new ChatGroupRoomMap_1.ChatGroupRoomMap(), []), true);
        this.chatRooms = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'ChatRoom', 'ChatRoom', new entity_cache_search_1.EntityCacheSearch(new ChatRoom_1.ChatRoom(), []), true);
        this.chatRoomChatMap = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'ChatRoomChatMap', 'ChatRoomChatMap', new entity_cache_search_1.EntityCacheSearch(new ChatRoomChatMap_1.ChatRoomChatMap(), []), true);
        this.chatRoomSecurityRules = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'ChatRoomSecurityRule', 'ChatRoomSecurityRule', new entity_cache_search_1.EntityCacheSearch(new ChatRoomSecurityRule_1.ChatRoomSecurityRule(), []), true);
        this.chatRoomUserMaps = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'ChatRoomUserMap', 'ChatRoomUserMap', new entity_cache_search_1.EntityCacheSearch(new ChatRoomUserMap_1.ChatRoomUserMap(), []), true);
        this.files = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'File', 'File', new entity_cache_search_1.EntityCacheSearch(new File_1.File(), []), true);
        this.personRoleTypes = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'PersonRoleType', 'PersonRoleType', new entity_cache_search_1.EntityCacheSearch(new PersonRoleType_1.PersonRoleType(), []), true);
        this.tableChangedViews = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'TableChangedView', 'TableChangedView', new entity_cache_search_1.EntityCacheSearch(new TableChangedView_1.TableChangedView(), []), true);
        this.users = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'User', 'User', new entity_cache_search_1.EntityCacheSearch(new User_1.User(), []), true);
        this.userCredentials = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'UserCredential', 'UserCredential', new entity_cache_search_1.EntityCacheSearch(new UserCredential_1.UserCredential(), []), true);
        this.userJWTs = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'UserJWT', 'UserJWT', new entity_cache_search_1.EntityCacheSearch(new UserJWT_1.UserJWT(), []), true);
        this.userRoleTypes = new entity_cache_server_1.EntityCacheServer(this.sequelize, 'UserRoleType', 'UserRoleType', new entity_cache_search_1.EntityCacheSearch(new UserRoleType_1.UserRoleType(), []), true);
        // Entity Views:  Do not have Id (PRIMARY KEY). So, we must remove the "id" attribute from the Model. Overwriting it with our "Id"
        //                property must not have entirely worked because of the non-primary key entity.
        this.sequelize.model(TableChangedView_1.TableChangedView).removeAttribute("id");
    }
    // Authenticates with the database
    EntityController.prototype.authenticate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log(this.sequelize.options);
                        return [4 /*yield*/, this.sequelize.authenticate()];
                    case 1:
                        _a.sent();
                        this.logger.log('Connection has been established successfully.');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.logger.logError('Unable to connect to the database:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EntityController.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sequelize.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EntityController.prototype.createTestData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, entity_test_data_1.EntityTestData.create(this)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        this.logger.logError(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EntityController.prototype.testConnectQuery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sequelize.authenticate().then(function () {
                                _this.logger.log("Connection has been established successfully.");
                                _this.logger.log("Querying Entities from Database");
                                _this.sequelize.model(Article_1.Article).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(ArticleBannerLinkType_1.ArticleBannerLinkType).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(Chat_1.Chat).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(ChatCategory_1.ChatCategory).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(ChatCategoryGroupMap_1.ChatCategoryGroupMap).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(ChatGroup_1.ChatGroup).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(ChatGroupRoomMap_1.ChatGroupRoomMap).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(ChatRoom_1.ChatRoom).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(ChatRoomChatMap_1.ChatRoomChatMap).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(ChatRoomSecurityRule_1.ChatRoomSecurityRule).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(File_1.File).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(PersonRoleType_1.PersonRoleType).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(TableChangedView_1.TableChangedView).findAll({
                                    raw: true,
                                }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(User_1.User).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(UserCredential_1.UserCredential).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(UserJWT_1.UserJWT).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                                _this.sequelize.model(UserRoleType_1.UserRoleType).findAll({ raw: true }).then(function (values) {
                                    _this.logger.log(values);
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        this.logger.logError('Error querying users:', error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return EntityController;
}());
exports.EntityController = EntityController;
