import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {UserController} from './server/controller/user.controller';
import {NewsController} from './server/controller/news.controller';
import {DataModel} from './server/model/server.datamodel';
import {ChatController} from './server/controller/chat.controller';

// Possibly old methods for NodeJS
import cors from 'cors';
import bodyParser from 'body-parser';
import {AuthController} from './server/controller/auth.controller';
import {FileController} from './server/controller/file.controller';
import {AuthService} from './server/service/auth.service';

// Some server constants
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
//const RSA_PRIVATE_KEY: string = fs.readFileSync('./demos/private.key');

// Application Instances
//
const app = express();
const angularApp = new AngularNodeAppEngine();

// -> Data
const serverDb = new DataModel();
//const jwt = require('jsonwebtoken');
//const PUBLIC_KEY:string = fs.readFileSync('public.key', 'utf-8');

// -> Services (Auth Service: Needs to complete JWT for key rotation and hosting)
const authService = new AuthService(serverDb);

// -> Controllers
const authController = new AuthController(serverDb, authService);
const userController = new UserController(serverDb, authService);
const newsController = new NewsController(serverDb, authService);
const chatController = new ChatController(serverDb, authService);
const fileController = new FileController(serverDb, authService);

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */


/*
    Server Workflow:
      - Pre-work Logging of Request (beginning of middleware function)
      - Work (body of middleware function)
      - Post-work Logging of Response (end of middleware function)

    Server API:
      - /api/users
      - /api/news
      - /api/people
      - /api/chat

    Server Static:
      - Initial index.html server function / "get fallback" method (**)
        which isn't actually static.
*/

/**
 * CORS
 */
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.get('origin') || '*');
  res.header('Access-Control-Allow-Credentials', '*');
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// POST methods were having trouble receiving JSON data from the client
//
app.use(bodyParser.json());

/**
 * JWT Request Headers
 */
//const SECRET_KEY = fs.readFileSync('public.key', 'utf-8');

/*
const checkIfAuthenticated = expressjwt({
  secret: SECRET_KEY,
  algorithms: ['HS256']
});
*/

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// expressjwt (auth) -> then (try jwt.verify) to retrieve user
//
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

// BYPASS FOR DEVELOPMENT:  Next problem is to implement the JWKS server
const expressAuth = function (req: any, res: any, next: () => void) {
  next();
}

app.use(expressAuth);

// User Session:  Login / Logout (JWT bearer tokens) (created and sent by the AuthController)
//
app.post('/api/login', (request, response) =>{
  authController.logon(request, response);
});
app.route('/api/login/getSession').get(expressAuth, (request, response) => {
  authController.authenticate(request, response);
  authController.getSession(request, response);
});

// API: File
app.route('/api/file/get/:fileName').get(expressAuth, (request, response) => {
  fileController.authenticate(request, response);
  fileController.get(request, response);
});
app.route('/api/file/post').post(expressAuth, (request, response) => {
  fileController.authenticate(request, response);
  fileController.post(request, response);
});

// API: Users
app.route('/api/users/get/:userName').get(expressAuth, (request, response) =>{
  userController.authenticate(request, response);
  userController.get(request, response);
});
app.route('/api/users/getPage').post(expressAuth, (request, response) =>{
  userController.authenticate(request, response);
  userController.getPage(request, response);
});
app.route('/api/users/exists/:userName').get(expressAuth, (request, response) =>{
  userController.authenticate(request, response);
  userController.exists(request, response);
});
app.route('/api/users/create').post(expressAuth, (request, response) =>{
  userController.authenticate(request, response);
  userController.create(request, response);
});

// API: News
app.route('/api/news/get/:newsId').get(expressAuth, (request, response) =>{
  newsController.authenticate(request, response);
  newsController.get(request, response);
});
app.route('/api/news/getPage').post(expressAuth, (request, response) =>{
  newsController.authenticate(request, response);
  newsController.getPage(request, response);
});
app.route('/api/news/create').post(expressAuth, (request, response) =>{
  newsController.authenticate(request, response);
  newsController.create(request, response);
});

// API: Chat
app.route('/api/chat/getRooms').get(expressAuth, (request, response) =>{
  chatController.authenticate(request, response);
  chatController.getChatRooms(request, response);
});
app.route('/api/chat/getRoom/:chatRoomRoute').get(expressAuth, (request, response) =>{
  chatController.authenticate(request, response);
  chatController.getChatRoom(request, response);
});
app.route('/api/chat/getChats/:chatRoomId').post(expressAuth, (request, response) =>{
  chatController.authenticate(request, response);
  chatController.getChats(request, response);
});
app.route('/api/chat/postChat/:chatRoomId').post(expressAuth, (request, response) =>{
  chatController.authenticate(request, response);
  chatController.postChat(request, response);
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {

  // CORS:  Must apply headers
  //req.headers["Access-Control-Allow-Origin"] = "*";
  //req.headers["Access-Control-Allow-Headers"] = "*";
  //req.headers["Access-Control-Allow-Methods"] = "GET,POST";
  /*
  res.header("Access-Control-Allow-Origin", req.get('origin'));
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  */

  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process?.env['PORT'] || '10000';
  app.listen(port, () => {
    console.log(`Node Express server listening on port ${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
