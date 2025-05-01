// Contains primary nodejs / express components
import {ServerApplication} from './server.application';
import {ServerEnvironment, ServerLoggerSettings} from './server.logger';
import { ArticleMiddleware } from './middleware/entity/article.middleware';
import {ChatMiddleware} from './middleware/entity/chat.middleware';
import {ChatCategoryMiddleware} from './middleware/entity/chat-category.middleware';
import {ChatCategoryGroupMapMiddleware} from './middleware/entity/chat-category-group-map.middleware';
import {ChatGroupMiddleware} from './middleware/entity/chat-group.middleware';
import {ChatGroupRoomMapMiddleware} from './middleware/entity/chat-group-room-map.middleware';
import {ChatRoomMiddleware} from './middleware/entity/chat-room.middleware';
import {FileMiddleware} from './middleware/entity/file.middleware';
import {UserMiddleware} from './middleware/entity/user.middleware';

/*
    Server Workflow:
      - Pre-work Logging of Request (beginning of middleware function)
      - Authentication
      - Work (body of middleware function)
      - Post-work Logging of Response (end of middleware function)

    Server API: Auth (non-repository) -> Repository (State) -> Repository (Data)
      - /api/auth/{api function}
      - /api/repository/.../{api function}
      - /api/{data}/.../{api function}/:{optional parameter 1}/:{optional parameter 2}/...

    Server Static:
      - Initial index.html server function / "get fallback" method (**)
        which isn't actually static.
*/

export class SmEsportsApiServer {

  private readonly apiServer: ServerApplication;

  // Configures the API server's middleware
  public configure() {

    // Primary Configuration:
    //
    // -> CORS
    // -> Headers
    // -> JSON
    // -> State Files (/browser)
    this.apiServer.beginConfigure();

    // -> More Middleware (one per Entity)
    this.apiServer.addMiddleware(new ArticleMiddleware(this.apiServer.logger, this.apiServer.entityController, 'article', false, true));
    this.apiServer.addMiddleware(new ChatMiddleware(this.apiServer.logger, this.apiServer.entityController, 'chat/:chatRoomId', false, true));
    this.apiServer.addMiddleware(new ChatCategoryMiddleware(this.apiServer.logger, this.apiServer.entityController, 'chatCategory', false, true));
    this.apiServer.addMiddleware(new ChatCategoryGroupMapMiddleware(this.apiServer.logger, this.apiServer.entityController, 'chatCategoryGroupMap', false, true));
    this.apiServer.addMiddleware(new ChatGroupMiddleware(this.apiServer.logger, this.apiServer.entityController, 'chatGroup', false, true));
    this.apiServer.addMiddleware(new ChatGroupRoomMapMiddleware(this.apiServer.logger, this.apiServer.entityController, 'chatGroupRoomMap', false, true));
    this.apiServer.addMiddleware(new ChatRoomMiddleware(this.apiServer.logger, this.apiServer.entityController, 'chatRoom', false, true));
    this.apiServer.addMiddleware(new FileMiddleware(this.apiServer.logger, this.apiServer.entityController, 'file', false, true));
    this.apiServer.addMiddleware(new UserMiddleware(this.apiServer.logger, this.apiServer.entityController, 'user', false, true));

    // -> Angular App (middleware) (SSR) (Default Route)
    this.apiServer.endConfigure();
  }

  // Initializes server's database connection
  public async initialize() {
    // INITIALIZE!  Sync sequel model
    await this.apiServer.initialize();
  }

  // Starts server listener
  public start() {
    this.apiServer.start();
  }

  public getApp() {
    return this.apiServer.getApp();
  }

  constructor() {

    // See node:util styleText
    const serverLoggerSettings = new ServerLoggerSettings(
      ServerEnvironment.DEV,  // (DEV, TEST, PROD) (needs input from angular)
      'redBright',            // Normal Logging
      'yellowBright',
      'white',
      true,                   // Prepend Date
      'white',                // "Special" Logging
      'greenBright',
      'yellowBright',
      'redBright');

    // Primary Component
    this.apiServer = new ServerApplication(serverLoggerSettings);
  }
}
