import { Sequelize } from "sequelize-typescript";
import { Article } from "./model/Article";
import { PersonRoleType } from './model/PersonRoleType';
import { File }  from "./model/File";
import {ChatCategory} from './model/ChatCategory';
import {ArticleBannerLinkType} from './model/ArticleBannerLinkType';
import {Chat} from './model/Chat';
import {ChatCategoryGroupMap} from './model/ChatCategoryGroupMap';
import {ChatGroup} from './model/ChatGroup';
import {ChatGroupRoomMap} from './model/ChatGroupRoomMap';
import {ChatRoom} from './model/ChatRoom';
import {ChatRoomChatMap} from './model/ChatRoomChatMap';
import {ChatRoomSecurityRule} from './model/ChatRoomSecurityRule';
import {ChatRoomUserMap} from './model/ChatRoomUserMap';
import {User} from './model/User';
import {UserRoleType} from './model/UserRoleType';
import { EntityCache } from "./entity-cache";
import { EntityCacheSearch } from "./entity-cache-search";
import {UserCredential} from './model/UserCredential';
import { TableChangedView } from "./model/TableChangedView";
import { UserJWT } from "./model/UserJWT";


export class EntityController {

  // ORM Adapter (postgres)
  private readonly sequelize:Sequelize;

  // Entity Caches (by Table <-> Typescript Model)
  public articles: EntityCache<Article>;
  public articleBannerLinkTypes: EntityCache<ArticleBannerLinkType>;
  public chats: EntityCache<Chat>;
  public chatCategories: EntityCache<ChatCategory>;
  public chatCategoryGroupMaps: EntityCache<ChatCategoryGroupMap>;
  public chatGroups: EntityCache<ChatGroup>;
  public chatGroupRoomMaps: EntityCache<ChatGroupRoomMap>;
  public chatRooms: EntityCache<ChatRoom>;
  public chatRoomChatMap: EntityCache<ChatRoomChatMap>;
  public chatRoomSecurityRules: EntityCache<ChatRoomSecurityRule>;
  public chatRoomUserMaps: EntityCache<ChatRoomUserMap>;
  public files: EntityCache<File>;
  public personRoleTypes: EntityCache<PersonRoleType>;
  public tableChangedViews: EntityCache<TableChangedView>;
  public users: EntityCache<User>;
  public userCredentials: EntityCache<UserCredential>;
  public userJWTs: EntityCache<UserJWT>;
  public userRoleTypes: EntityCache<UserRoleType>;

  /*

  // Auth Service (this may move to separate auth server)
  userTokenMap: Map<string, string>;
  tokenMap: Map<string, UserJWTPayload>;
*/
  // Creates an instance of the server database using environment variable settings [USER, PASSWORD, HOST, DB])
  constructor(){

    this.sequelize = new Sequelize(process.env['DB']!,
                                   process.env['DB_USER']!,
                                   String(process.env['DB_PASSWORD']), {
        dialect: "postgres",
        host: process.env['HOST']!,
        models: [
          Article,                            // NOTE*** These are ModelCtor instances (new ():T => T)
          ArticleBannerLinkType,
          Chat,
          ChatCategory,
          ChatCategoryGroupMap,
          ChatGroup,
          ChatGroupRoomMap,
          ChatRoom,
          ChatRoomChatMap,
          ChatRoomSecurityRule,
          ChatRoomUserMap,
          File,
          PersonRoleType,
          TableChangedView,
          User,
          UserCredential,
          UserJWT,
          UserRoleType
        ],
        schema: "public",
        query: {
          raw: true                           // NOTE!  The "non-raw" option doesn't map directly to an entity!
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
    this.articles = new EntityCache<Article>('Article', 'Article', new EntityCacheSearch<Article>(new Article(), []), [], true);
    this.articleBannerLinkTypes = new EntityCache<ArticleBannerLinkType>('ArticleBannerLinkType', 'ArticleBannerLinkType', new EntityCacheSearch<ArticleBannerLinkType>(new ArticleBannerLinkType(), []), [], true);
    this.chats =  new EntityCache<Chat>('Chat', 'Chat', new EntityCacheSearch<Chat>(new Chat(), []), [], true);
    this.chatCategories = new EntityCache<ChatCategory>('ChatCategory', 'ChatCategory', new EntityCacheSearch<ChatCategory>(new ChatCategory(), []), [], true);
    this.chatCategoryGroupMaps = new EntityCache<ChatCategoryGroupMap>('ChatCategoryGroupMap', 'ChatCategoryGroupMap', new EntityCacheSearch<ChatCategoryGroupMap>(new ChatCategoryGroupMap(), []), [], true);
    this.chatGroups =  new EntityCache<ChatGroup>('ChatGroup', 'ChatGroup', new EntityCacheSearch<ChatGroup>(new ChatGroup(), []), [], true);
    this.chatGroupRoomMaps =  new EntityCache<ChatGroupRoomMap>('ChatGroupRoomMap', 'ChatGroupRoomMap', new EntityCacheSearch<ChatGroupRoomMap>(new ChatGroupRoomMap(), []), [], true);
    this.chatRooms = new EntityCache<ChatRoom>('ChatRoom', 'ChatRoom', new EntityCacheSearch<ChatRoom>(new ChatRoom(), []), [], true);
    this.chatRoomChatMap = new EntityCache<ChatRoomChatMap>('ChatRoomChatMap', 'ChatRoomChatMap', new EntityCacheSearch<ChatRoomChatMap>(new ChatRoomChatMap(), []), [], true);
    this.chatRoomSecurityRules = new EntityCache<ChatRoomSecurityRule>('ChatRoomSecurityRule', 'ChatRoomSecurityRule', new EntityCacheSearch<ChatRoomSecurityRule>(new ChatRoomSecurityRule(), []), [], true);
    this.chatRoomUserMaps = new EntityCache<ChatRoomUserMap>('ChatRoomUserMap', 'ChatRoomUserMap', new EntityCacheSearch<ChatRoomUserMap>(new ChatRoomUserMap(), []), [], true);
    this.files = new EntityCache<File>('File', 'File', new EntityCacheSearch<File>(new File(), []), [], true);
    this.personRoleTypes = new EntityCache<PersonRoleType>('PersonRoleType', 'PersonRoleType', new EntityCacheSearch<PersonRoleType>(new PersonRoleType(), []), [], true);
    this.tableChangedViews = new EntityCache<TableChangedView>('TableChangedView', 'TableChangedView', new EntityCacheSearch<TableChangedView>(new TableChangedView(), []), [], true);
    this.users = new EntityCache<User>('User', 'User', new EntityCacheSearch<User>(new User(), []), [], true);
    this.userCredentials = new EntityCache<UserCredential>('UserCredential', 'UserCredential', new EntityCacheSearch<UserCredential>(new UserCredential(), []), [], true);
    this.userJWTs = new EntityCache<UserJWT>('UserJWT', 'UserJWT', new EntityCacheSearch<UserJWT>(new UserJWT(), []), [], true);
    this.userRoleTypes = new EntityCache<UserRoleType>('UserRoleType', 'UserRoleType', new EntityCacheSearch<UserRoleType>(new UserRoleType(), []), [], true);

    // Entity Views:  Do not have Id (PRIMARY KEY). So, we must remove the "id" attribute from the Model. Overwriting it with our "Id"
    //                property must not have entirely worked because of the non-primary key entity.
    this.sequelize.model(TableChangedView).removeAttribute("id");
  }

  // Authenticates with the database
  public async authenticate() {
    try {
      console.log(this.sequelize.options);

      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  public async disconnect() {
    await this.sequelize.close();
  }

  public async test() {

    try {

      await this.sequelize.authenticate().then(() =>{
        console.log("Connection has been established successfully.");
        console.log("Querying Entities from Database");

        this.sequelize.model(Article).findAll({ raw: true }).then(values => {
            console.log(values);
        });
        this.sequelize.model(ArticleBannerLinkType).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(Chat).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(ChatCategory).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(ChatCategoryGroupMap).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(ChatGroup).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(ChatGroupRoomMap).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(ChatRoom).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(ChatRoomChatMap).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(ChatRoomSecurityRule).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(File).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(PersonRoleType).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(TableChangedView).findAll({
          raw: true,
        }).then(values => {
          console.log(values);
        });
        this.sequelize.model(User).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(UserCredential).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(UserJWT).findAll({ raw: true }).then(values => {
          console.log(values);
        });
        this.sequelize.model(UserRoleType).findAll({ raw: true }).then(values => {
          console.log(values);
        });
      });
    }
    catch(error) {
      console.error('Error querying users:', error);
    }
  }
}
