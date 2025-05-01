import {bootstrapApplication, platformBrowser} from '@angular/platform-browser';
import { AppModule } from './app/module/app.module';
import {platformServer} from '@angular/platform-server';
import {AppComponent} from './app/component/app.component';
import {appConfig} from './app/app.config';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {SmEsportsApiServer} from './server/SmEsportsApiServer';

//const apiServer = new SmEsportsApiServer();

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
}).then(async () => {

  //apiServer.configure();
  //await apiServer.initialize();
  //apiServer.start();

}).catch(err => console.error(err));
