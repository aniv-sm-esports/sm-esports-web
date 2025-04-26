import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {ControllerManagerService} from './service/controller-manager.service';
import {
  AuthControllerName,
  ChatCategoryControllerName,
  ChatGroupControllerName,
  ChatRoomControllerName,
  ChatCategoryGroupMapControllerName,
  ChatGroupRoomMapControllerName,
  FileControllerName,
  NewsControllerName,
  UserControllerName
} from './service/controller-const';
import {AuthController} from './controller/auth.controller';
import {UserJWT} from '../app/model/service/user-logon.model';
import {DataModel} from './model/server.datamodel';
import {AuthService} from './service/auth.service';
import {UserController} from './controller/user.controller';
import {NewsController} from './controller/news.controller';
import {FileController} from './controller/file.controller';
import {ChatRoomController} from './controller/chat-room.controller';
import cors from 'cors';
import {AuthMiddleware} from './middleware/auth.middleware';
import {HttpMethod, MiddlewareBase} from './middleware/base.middleware';
import {LoggerMiddleware} from './middleware/logger.middleware';
import moment from 'moment';
import 'reflect-metadata';
import {ChatGroupController} from './controller/chat-group.controller';
import {ChatCategoryController} from './controller/chat-category.controller';
import {ChatCategoryGroupMapController} from './controller/chat-category-group-map.controller';
import {ChatGroupRoomMapController} from './controller/chat-group-room-map.controller';
import {ServerDatabase} from './database/server.database';

// Application Instances
//


export class ServerLocals {
  public userJWT: UserJWT = UserJWT.default();
}

// !!!MIDDLEWARE ISSUES SECION!!!

/*
const expressAuth = expressjwt({
  algorithms: ['HS256'],
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
});
*/

export class ServerApplication {

  //const RSA_PRIVATE_KEY: string = fs.readFileSync('./demos/private.key');

  // (pre-startup)
  private readonly serverDistFolder = dirname(fileURLToPath(import.meta.url));
  private readonly browserDistFolder = resolve(this.serverDistFolder, '../browser');
  private readonly databaseModelFolder = resolve(this.serverDistFolder, '../database/model');

  // NodeJS / Express
  private readonly app = express();
  private readonly angularApp = new AngularNodeAppEngine();

  // Begin (our) Data
  private readonly database:ServerDatabase = new ServerDatabase(this.databaseModelFolder);
  private readonly serverDb;
  //const jwt = require('jsonwebtoken');
  //const PUBLIC_KEY:string = fs.readFileSync('public.key', 'utf-8');

  // Begin (our) Middleware
  private readonly authService: AuthService;
  private readonly controllerManagerService: ControllerManagerService;
  private readonly authMiddleware: AuthMiddleware;
  private readonly loggerMiddleware: LoggerMiddleware;

  constructor() {

    this.serverDb = new DataModel();
    this.authService = new AuthService(this.serverDb);
    this.controllerManagerService = new ControllerManagerService(this.serverDb, this.authService);

    // Middleware (route not required by express)
    this.authMiddleware = new AuthMiddleware(this.controllerManagerService, "/", HttpMethod.GET);
    this.loggerMiddleware = new LoggerMiddleware(this.controllerManagerService, "/", HttpMethod.POST);

    // PRIMARY CONTROLLERS (Chat primary controllers must be set later..one per chat room)
    this.controllerManagerService.setPrimaryController(AuthControllerName, new AuthController(this.serverDb, this.authService));
    this.controllerManagerService.setPrimaryController(UserControllerName, new UserController(this.serverDb, this.authService, true));
    this.controllerManagerService.setPrimaryController(NewsControllerName, new NewsController(this.serverDb, this.authService, true));
    this.controllerManagerService.setPrimaryController(FileControllerName, new FileController(this.serverDb, this.authService, true));
    this.controllerManagerService.setPrimaryController(ChatRoomControllerName, new ChatRoomController(this.serverDb, this.authService, true));
    this.controllerManagerService.setPrimaryController(ChatGroupControllerName, new ChatGroupController(this.serverDb, this.authService, true));
    this.controllerManagerService.setPrimaryController(ChatCategoryControllerName, new ChatCategoryController(this.serverDb, this.authService, true));
    this.controllerManagerService.setPrimaryController(ChatGroupRoomMapControllerName, new ChatGroupRoomMapController(this.serverDb, this.authService, true));
    this.controllerManagerService.setPrimaryController(ChatCategoryGroupMapControllerName, new ChatCategoryGroupMapController(this.serverDb, this.authService, true));

    // -> Initialize Controllers
    this.controllerManagerService.initialize();
  }

  public configure(middleware: MiddlewareBase[]) {

    // NodeJS / Express Setup
    //
    // CORS
    this.app.use(cors());

    // Headers
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", req.get('origin') || '*');
      res.header('Access-Control-Allow-Credentials', '*');
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Access-Control-Allow-Headers", "*");
      next();
    });

    // JSON: Json serialization does not deal nicely with functions. Best to use
    //       dedicated data classes.
    //
    this.app.use(express.json({

        // Express.js website:  The reviver option is passed directly to JSON.parse as the second argument.
        // You can find more information on this argument in the MDN documentation about JSON.parse.
        //
        // https://expressjs.com/en/resources/middleware/body-parser.html
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Example.3A_Using_the_reviver_parameter
        //
        // NOTE*** To finish the serialization problem with decorators, the emitDecoratorMetadata flag may be used. This will require
        //         more digging to see how these 3 other frameworks are operating:  busboy, class-transformer, ...angular! There is a
        //         way to query the metadata. So, some custom @Type may be used to say it's "moment".
        //
        // Update: Switching from Moment -> Date for all public data fields. Moment is still used for Date manipulation; but for data
        //         serialization and comparison I think there's things that aren't quite finished with a "primary method".
        //
        reviver: (key, value) => {

          // key === "" implies object root (see MDN)
          //
          // These keys were queried from the code.
          if (key === "date" ||
              key === "accountCreation" ||
              key === "loginTime" ||
              key === "expirationTime" ||
              key === "expiresAt" ||
              key === "loggedinAt") {
            //console.log(`Date JSON found:  Key(${key}), Value(${value})`);
            //console.log("Date JSON deserialized:  Moment:  ", moment(value).toDate());
            return moment(value).toDate();
          }

          return value;
        }
    }));

    /**
     * Serve static files from /browser
     */
    this.app.use(
      express.static(this.browserDistFolder, {
        maxAge: '1y',
        index: false,
        redirect: false,
      }),
    );

    // Server Endpoints:  (Our Middleware)
    middleware.forEach((middleware: MiddlewareBase) => {

      console.log(`-> Server Endpoint:  (${middleware.method}) ` + middleware.route);

      // GET: Authenticate -> ...
      if (middleware.method === HttpMethod.GET) {
        this.app
          .route(middleware.route)
          .get((req, res, next) => {
            this.loggerMiddleware.apply(req, res, next);
          }, (req, res, next) => {
            this.authMiddleware.apply(req, res, next);
          }, (req, res, next) => {
            middleware.apply(req, res, next);
          });
      }

      // POST: Authenticate -> ...
      else if (middleware.method === HttpMethod.POST) {
        this.app
          .route(middleware.route)
          .post((req, res, next) => {
            this.loggerMiddleware.apply(req, res, next);
          }, (req, res, next) => {
            this.authMiddleware.apply(req, res, next);
          }, (req, res, next) => {
            middleware.apply(req, res, next);
          });
      }
      else {
        console.log("Error: Server Configuration unhandled HttpMethod " + middleware.method);
        return;
      }

    });

    /**
     * Handle all other requests by rendering the Angular application.
     */
    this.app.use('/**', (req, res, next) => {
      this.angularApp
        .handle(req)
        .then((response) =>
          response ? writeResponseToNodeResponse(response, res) : next(),
        )
        .catch(next);
    });

    console.log("Server Application Configuration Complete!");
  }

  public initialize() {
    //this.database.test();
  }

  public start() {

    /**
     * Start the server if this module is the main entry point.
     * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
     */
    if (isMainModule(import.meta.url)) {
      const port = process?.env['PORT'] || '10000';
      this.app.listen(port, () => {
        console.log(`Node Express server listening on port ${port}`);
      });
    }
  }

  public getControllerManager(): ControllerManagerService {
    return this.controllerManagerService;
  }

  public getApp() {
    return this.app;
  }
}
