import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../component/app.component';
import {MainTabComponent} from '../component/maintab.component';
import {ChatTabComponent} from '../component/chattab.component';
import {NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButtonToggle} from '@angular/material/button-toggle';
import {MatButton, MatButtonModule} from '@angular/material/button';

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
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatButtonToggle,
    MatButtonModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    HttpClient,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
