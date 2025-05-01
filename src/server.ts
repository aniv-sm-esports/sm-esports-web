import {
  createNodeRequestHandler,
  isMainModule,
} from '@angular/ssr/node';
import {SmEsportsApiServer} from './server/SmEsportsApiServer';

// REQUIRED FOR NODE / SSR TO START SERVER!!!!!
export { AppServerModule as default } from './app/module/app.module.server';

const server = new SmEsportsApiServer();

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {

  console.log("Configuring API Server...");
  server.configure();

  console.log("Initializing API Server...");
  server.initialize().then(() => {

    console.log("Starting Api Server!");
    server.start();
  })
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(server.getApp());
