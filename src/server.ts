import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {inject} from '@angular/core';
import {UserController} from './server/controller/user.controller';
import {NewsController} from './server/controller/news.controller';
import {DataModel} from './server/model/server.datamodel';
import {News} from './app/model/news.model';
import {ChatController} from './server/controller/chat.controller';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Application Instances
//
const app = express();
const angularApp = new AngularNodeAppEngine();

// -> Data
const serverDb = new DataModel();

// -> Controllers
const userController = new UserController(serverDb);
const newsController = new NewsController(serverDb);
const chatController = new ChatController(serverDb);

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
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// API: Users -> Get
app.get('/api/users/get/:userId', async (req, res) => {
  userController.get(req, res);
});

// API: Users -> GetAll
app.get('/api/users/getAll', async (req, res) => {
  userController.getAll(req, res);
});

// API: Users -> Exists
app.get('/api/users/exists/:userName', async (req, res) => {
  userController.exists(req, res);
});

// API: Users -> Create
app.get('/api/users/create/:userName', async (req, res) => {
  userController.create(req, res);
});

// API: News -> Get
app.get('/api/news/get/:newsId', async (req, res) => {
  newsController.get(req, res);
});

// API: News -> GetAll
app.get('/api/news/getAll', (req, res) => {
  newsController.getAll(req, res);
});

// API: News -> Create
app.post('/api/news/create', async (req, res) => {
  newsController.create(req, res);
});

// API: Chat -> GetChatRooms
app.get('/api/chat/getRooms', async (req, res) => {
  chatController.getChatRooms(req, res);
});

// API: Chat -> GetChats
app.get('/api/chat/getChats/:chatRoomId', async (req, res) => {
  chatController.getChats(req, res);
});

// API: Chat -> PostChat
app.post('/api/chat/postChat/:chatRoomId', async (req, res) => {
  chatController.postChat(req, res);
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {

  // CORS:  Must apply headers
  req.headers["Access-Control-Allow-Origin"] = "*";
  req.headers["Access-Control-Allow-Headers"] = "*";

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
