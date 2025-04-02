import { Routes, Route } from '@angular/router';
import {HomeComponent} from './component/home.component';
import {NewsComponent} from './component/news.component';
import {PeopleComponent} from './component/people.component';
import {ChatComponent} from './component/chat.component';

export const routes: Routes = [
  { path:"home",  component: HomeComponent },
  { path:"news",  component: NewsComponent },
  { path:"people",  component: PeopleComponent },
  { path:"chat",  component: ChatComponent },
  { path: 'users/getAll', component: HomeComponent },
  { path: 'users/create/:userName', component: HomeComponent },
  { path: 'news/getAll', component: NewsComponent },
  { path: 'news/create', component: NewsComponent },
  {
    path: '**', redirectTo: 'home'
  }
];
