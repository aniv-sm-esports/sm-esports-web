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

// -> Controllers
const authController = new AuthController(serverDb);
const userController = new UserController(serverDb);
const newsController = new NewsController(serverDb);
const chatController = new ChatController(serverDb);
const fileController = new FileController(serverDb);

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

// User Session:  Login / Logout (JWT bearer tokens) (created and sent by the AuthController)
//
app.post('/api/login', (request, response) =>{
  authController.logon(request, response);
});

// API: File
app.get('/api/file/get/:fileName', (request, response) => {
  fileController.authenticate(request, response);
  fileController.get(request, response);
});
app.post('/api/file/post', (request, response) => {
  fileController.authenticate(request, response);
  fileController.post(request, response);
});

// API: Users
app.get('/api/users/get/:userName', (request, response) =>{
  userController.authenticate(request, response);
  userController.get(request, response);
});
app.get('/api/users/getAll', (request, response) =>{
  userController.authenticate(request, response);
  userController.getAll(request, response);
});
app.get('/api/users/exists/:userName', (request, response) =>{
  userController.authenticate(request, response);
  userController.exists(request, response);
});
app.get('/api/users/create/:userName', (request, response) =>{
  userController.authenticate(request, response);
  userController.create(request, response);
});

// API: News
app.get('/api/news/get/:newsId', (request, response) =>{
  newsController.authenticate(request, response);
  newsController.get(request, response);
});
app.get('/api/news/getAll', (request, response) =>{
  newsController.authenticate(request, response);
  newsController.getAll(request, response);
});
app.post('/api/news/create', (request, response) =>{
  newsController.authenticate(request, response);
  newsController.create(request, response);
});

// API: Chat
app.get('/api/chat/getRooms', (request, response) =>{
  chatController.authenticate(request, response);
  chatController.getChatRooms(request, response);
});
app.get('/api/chat/getRoom/:chatRoomRoute', (request, response) =>{
  chatController.authenticate(request, response);
  chatController.getChatRoom(request, response);
});
app.get('/api/chat/getChats/:chatRoomId', (request, response) =>{
  chatController.authenticate(request, response);
  chatController.getChats(request, response);
});
app.post('/api/chat/postChat/:chatRoomId', (request, response) =>{
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
  const port = process?.env['PORT'] || '4200';
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
