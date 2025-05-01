import {AuthService} from './service/auth.service';
import cors from 'cors';
import {AuthMiddleware} from './middleware/auth.middleware';
import {LoggerMiddleware} from './middleware/logger.middleware';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'reflect-metadata';
import {EntityController} from './entity/entity-controller';
import {ServerLogger, ServerLoggerSettings} from './server.logger';
import {UserJWT} from './entity/model/UserJWT';
import {EntityMiddleware} from './middleware/entity/entity.middleware';
import { Entity } from './entity/model/Entity';
import {NextFunction, ParamsDictionary} from 'express-serve-static-core';

// Application Instances
//


export class ServerLocals {
  public userJWT: UserJWT | undefined;
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

  // NodeJS / Express
  private readonly app = express();
  private readonly angularApp = new AngularNodeAppEngine();

  // Begin (our) Data
  public readonly entityController: EntityController;
  //const jwt = require('jsonwebtoken');
  //const PUBLIC_KEY:string = fs.readFileSync('public.key', 'utf-8');

  // Begin (our) Middleware
  public readonly authService: AuthService;
  public readonly authMiddleware: AuthMiddleware;
  public readonly loggerMiddleware: LoggerMiddleware;

  // Utilities
  public readonly logger: ServerLogger;

  constructor(settings: ServerLoggerSettings) {

    this.logger = new ServerLogger(settings);
    this.entityController = new EntityController(this.logger);
    this.authService = new AuthService(this.entityController, this.logger);

    // Middleware (route not required by express)
    this.authMiddleware = new AuthMiddleware(this.entityController, this.authService, this.logger);
    this.loggerMiddleware = new LoggerMiddleware(this.logger);
  }

  public beginConfigure() {

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
/*
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
*/
    // Auth Middleware
    this.app.route("/api/auth/login").post(this.authMiddleware.logon);
    this.app.route("/api/auth/create").post(this.authMiddleware.create);
    this.app.route("/api/auth/getSession").post(this.authMiddleware.getSession);

    this.logger.log("-> Server Endpoint:  (POST) " + "api/auth/login");
    this.logger.log("-> Server Endpoint:  (POST) " + "api/auth/create");
    this.logger.log("-> Server Endpoint:  (POST) " + "api/auth/getSession");
  }

  public endConfigure() {
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

  public addMiddleware<T extends Entity<T>, U extends ParamsDictionary>(middleware: EntityMiddleware<T, U>) {

    // Procedure
    //
    // 0) LoggerMiddleware: Log the request data: URL, ...
    // 1) AuthMiddleware:   Authenticate, store user session (UserJWT) on response.locals['userJWT']
    // 2) EntityMiddleware:
    //    -> Validate (override)
    //    -> Cache State / CRUD method
    //    -> Send Response
    // 3) Log Result (on exit?) (TBD)

    const routeFormat = "api/entity/" + middleware.routeBase;
    const checkState = routeFormat + '/checkState';
    const getState = routeFormat + '/getState';
    const setState = routeFormat + '/setState';
    const get = routeFormat + '/get';
    const getAll = routeFormat + '/getAll';
    const create = routeFormat + '/create';

    this.app.route(checkState).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.checkState);
    this.app.route(getState).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.getState);
    this.app.route(setState).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.setState);
    this.app.route(get).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.get);
    this.app.route(getAll).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.getAll);
    this.app.route(create).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.create);

    this.logger.log("-> Server Endpoint:  (POST) " + checkState);
    this.logger.log("-> Server Endpoint:  (POST) " + getState);
    this.logger.log("-> Server Endpoint:  (POST) " + setState);
    this.logger.log("-> Server Endpoint:  (POST) " + get);
    this.logger.log("-> Server Endpoint:  (POST) " + getAll);
    this.logger.log("-> Server Endpoint:  (POST) " + create);

  }

  public async initialize() {
    //this.database.test();
    //await this.entityController.testConnectQuery();
    await this.entityController.authenticate();
  }

  public start() {

    const port = process?.env['PORT'] || '10000';
    this.app.listen(port, () => {
      this.logger.logSpecial(`Node Express server listening on port ${port}`);
    });
  }

  public getApp() {
    return this.app;
  }
}
