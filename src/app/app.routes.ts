import { Routes, Route } from '@angular/router';
import {HomeComponent} from './component/home.component';
import {NewsComponent} from './component/news.component';
import {PeopleComponent} from './component/people.component';
import {ChatComponent} from './component/chat.component';
import {ChatBoxComponent} from './component/chatbox.component';

export const routes: Routes = [
  { path:"home",  component: HomeComponent },
  { path:"news",  component: NewsComponent },
  { path:"people",  component: PeopleComponent },
  { path:"chat",  component: ChatComponent, children: [
      { path:"politics", component: ChatBoxComponent },
      { path:"people", component: ChatBoxComponent },
      { path:"speed-running", component: ChatBoxComponent },
      { path:"general", component: ChatBoxComponent }
    ]
  },
  { path: 'users/getAll', component: HomeComponent },
  { path: 'users/create/:userName', component: HomeComponent },
  { path: 'news/getAll', component: NewsComponent },
  { path: 'news/create', component: NewsComponent },
  {
    path: '**', redirectTo: 'home'
  }
];
