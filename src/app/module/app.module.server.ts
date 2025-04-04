import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { AppComponent } from '../component/app.component';
import { AppModule } from './app.module';
import { serverRoutes } from '../app.routes.server';
import {UserController} from '../../server/controller/user.controller';
import {NewsController} from '../../server/controller/news.controller';
import {DataModel} from '../../server/model/server.datamodel';

@NgModule({
  imports: [AppModule, ServerModule],
  providers: [provideServerRouting(serverRoutes)],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
