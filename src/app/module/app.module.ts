import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../component/app.component';
import {NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserService} from '../service/user.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NewsService} from '../service/news.service';
import {AppService} from '../service/app.service';
import {ClickOutsideModule} from 'ng-click-outside';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgOptimizedImage,
    ClickOutsideModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    HttpClient,
    UserService,
    NewsService,
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
