import { Routes, Route } from '@angular/router';
import {HomeComponent} from './component/home.component';
import {NewsComponent} from './component/news.component';
import {PeopleComponent} from './component/people.component';
import {ChatComponent} from './component/chat.component';
import {ChatBoxComponent} from './component/chatbox.component';
import {PersonalComponent} from './component/personal.component';
import {LoginComponent} from './component/login.component';
import {CreateAccountComponent} from './component/create-account.component';
import {LiveComponent} from './component/live.component';
import {ScheduleComponent} from './component/schedule.component';
import {AgendaComponent} from './component/agenda.component';
import {PeopleAllComponent} from './component/people-all.component';
import {PeopleBoardComponent} from './component/people-board.component';
import {PeopleSearchComponent} from './component/people-search.component';
import {RouteData} from './model/route-data.model';
import {Tab} from './model/tab.model';

/*
export const routes: Routes = [
  { path:"login",  component: LoginComponent, title: 'Login'},
  { path:"create-account",  component: CreateAccountComponent, title: 'Create Account' },
  { path:"home",  component: HomeComponent, title: 'Super Metroid Esports!',
    children: [
      { path:"live",  component: LiveComponent, title: 'Live' },
      { path:"schedule",  component: ScheduleComponent, title: 'Schedule' },
      { path:"agenda",  component: AgendaComponent, title: 'Agenda' },
    ] },
  { path:"news",  component: NewsComponent, title: 'News' },
  { path:"people",  component: PeopleComponent, title: 'People', children:[
      { path:"all",  component: PeopleAllComponent, title: 'All' },
      { path:"board",  component: PeopleBoardComponent, title: 'Board' },
      { path:"search",  component: PeopleSearchComponent, title: 'Search' },
    ] },
  { path:"personal/:userName",  component: PersonalComponent, title: 'Personal - :userName' },
  { path:"chat",  component: ChatComponent, title: 'Chat', children: [
      { path:"politics", component: ChatBoxComponent, title: 'Chat > Politics' },
      { path:"people", component: ChatBoxComponent, title: 'Chat > People' },
      { path:"speed-running", component: ChatBoxComponent, title: 'Chat > Speed Running' },
      { path:"general", component: ChatBoxComponent, title: 'Chat > General' },
    ]
  },
  {
    path: '**', redirectTo: 'home'
  }
];*/
