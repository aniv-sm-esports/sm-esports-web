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


export class ServerDatabase {

  private readonly sequelize:Sequelize;

  // Creates an instance of the server database using environment variable settings [USER, PASSWORD, HOST, DB])
  constructor(private readonly databaseModelFolder:string){

    this.sequelize = new Sequelize(process.env['DB']!,
                                   process.env['DB_USER']!,
                                   String(process.env['DB_PASSWORD']), {
        dialect: "postgres",
        host: process.env['HOST']!,
        models: [
          Article,
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
          User,
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
        this.sequelize.model(User).findAll({ raw: true }).then(values => {
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
