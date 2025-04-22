import { NgModule, NgZone } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../component/app.component';
import {NgOptimizedImage} from '@angular/common';
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
    SideNavComponent
  ],
  providers: [
    provideClientHydration(withEventReplay()),
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
    ZoomService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
