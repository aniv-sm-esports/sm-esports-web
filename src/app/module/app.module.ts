import { NgModule, NgZone } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../component/app.component';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserService} from '../service/user.service';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import {NewsService} from '../service/news.service';
import {AppService} from '../service/app.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {AuthInterceptor} from '../interceptor/auth.interceptor';
import {ClickOutsideDirective} from '../directive/click-outside.directive';
import {LoginComponent} from '../component/control/login.component';
import {ZoomService} from '../service/zoom.service';
import {UserDropdownComponent} from "../component/control/user-dropdown.component";
import {SideNavComponent} from '../component/control/side-nav.component';
import {ChatCategoryGroupMapService} from '../service/chat-category-group-map.service';
import { ChatCategoryService } from '../service/chat-category.service';
import {ChatGroupService} from '../service/chat-group.service';
import {ChatService} from '../service/chat.service';
import {ChatRoomService} from '../service/chat-room.service';
import {ChatGroupRoomMapService} from '../service/chat-group-room-map.service';

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
    FontAwesomeModule,
    ClickOutsideDirective,
    LoginComponent,
    UserDropdownComponent,
    SideNavComponent,
    CommonModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    HttpClient,
    UserService,
    NewsService,
    AppService,
    ZoomService,
    ChatRoomService,
    ChatGroupService,
    ChatCategoryService,
    ChatGroupRoomMapService,
    ChatCategoryGroupMapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
