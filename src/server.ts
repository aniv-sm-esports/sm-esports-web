import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataModel } from './server/model/server.datamodel';
import {GetUsersResponse, User, UserResponse} from './app/model/user.model';
import {News, NewsResponse} from './app/model/news.model';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// TODO: Create the In Memory Database using angular's component model
const serverDb: DataModel = new DataModel();

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
app.get('/users/:userName', async (req, res) => {

  console.log(`Server Request:  /users/${req.params.userName}`);

  let user = serverDb.users.find((value: User, index: number, userArray: User[])=> {
    return value.name == req.params.userName;
  });

  res.send(user);

});

// API: Users -> GetAll
app.get('/users/getAll', async (req, res) => {

  console.log('Server Request:  /users/getAll');

  res.send(new GetUsersResponse(serverDb.users));
});

// API: Users -> HasDuplicate
app.get('/users/hasDuplicate/:userName', async (req, res) => {

  console.log(`Server Request:  /users/hasDuplicate/${req.params.userName}`);

  // Check for duplicate users
  return serverDb.users.some(value => {
    return value.name == req.params.userName;
  });
});

// API: Users -> Create
app.get('/users/create/:userName', async (req, res) => {

  console.log("Server Request:  /users/create/" + req.params.userName);

  // Check for duplicate users
  if (serverDb.users.some((value) =>{
    return value.name == req.params.userName;
  }))
  {
    // Existing User
    let existingUser = serverDb.users.find((value: User, index: number, userArray: User[])=> {
      return value.name == req.params.userName;
    });

    res.send(new UserResponse(existingUser || User.default(), true, `User Creation Failed:  Duplicate user already exists`));
    return;
  }

  // Add User to in memory database
  serverDb.users.push(new User(serverDb.users.length, req.params.userName));

  // User Created
  let newUser = serverDb.users[serverDb.users.length-1];

  res.send(new UserResponse(newUser, true, `User Created ${serverDb.users[serverDb.users.length - 1]}`));
});

// API: News -> Get
app.get('/news/:id', async (req, res) => {

  console.log(`Server Request:  /news/${req.params.id}`);

  // Existing News
  let news = serverDb.news.find((value: News, index: number, userArray: News[])=> {
    return value.id.toString() == req.params.id;
  });

  // Success
  let success = !!news;

  res.send(new NewsResponse([news|| new News()], success, ''));

});

// API: News -> GetAll
app.get('/news/getAll', (req, res) => {

  console.log('Server Request:  /news/getAll');

  res.send(new NewsResponse(serverDb.news, true, "This is a message"));
});

// API: News -> Create
app.post('/news/create', async (req, res) => {

  console.log("Server Request:  /news/create");
  console.log(req.body);

  // Check for duplicate users
  if (serverDb.news.some((value:News) =>{
    return value.id == req.body.id;
  }))
  {
    // Existing Article (id)
    let existingNews = serverDb.news.find((value: News, index: number, userArray: News[])=> {
      return value.id == req.body.id;
    });

    res.send(new NewsResponse([existingNews || new News()], false, `News Creation Failed:  Duplicate entry already exists`));
    return;
  }

  // Add News to in memory database
  let newEntry = new News();

  newEntry.id = serverDb.news.length;
  newEntry.title = req.body.title;
  newEntry.description = req.body.description;
  newEntry.bodyHtml = req.body.bodyHtml;
  newEntry.date = req.body.date;

  serverDb.news.push(newEntry);

  res.send(new NewsResponse([newEntry], true, `News Created ${serverDb.news[serverDb.news.length - 1]}`));
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
