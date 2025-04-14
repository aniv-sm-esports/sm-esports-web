import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../component/home.component';
import {NewsComponent} from '../component/news.component';
import {PeopleComponent} from '../component/people.component';
import {ChatComponent} from '../component/chat.component';
import {ChatBoxComponent} from '../component/chatbox.component';
import {PersonalComponent} from '../component/personal.component';
import {LoginComponent} from '../component/login.component';
import {CreateAccountComponent} from '../component/create-account.component';
import {LiveComponent} from '../component/live.component';
import {ScheduleComponent} from '../component/schedule.component';
import {AgendaComponent} from '../component/agenda.component';
import {PeopleAllComponent} from '../component/people-all.component';
import {PeopleBoardComponent} from '../component/people-board.component';
import {PeopleSearchComponent} from '../component/people-search.component';
import {Tab} from '../model/tab.model';
import {ContactComponent} from '../component/contact.component';

export const routes: Routes = [
  { path:"login",  component: LoginComponent, title: 'Login'},
  { path:"create-account",  component: CreateAccountComponent, title: 'Create Account' },

  { path:"home", component: HomeComponent, title: 'Home',
    data: [Tab.from('Live', 'home/live'), Tab.from('Schedule', 'home/schedule'), Tab.from('Agenda', 'home/agenda')]},

  { path:"home/live",  component: LiveComponent, title: 'Home (Live)',
    data: [Tab.from('Live', 'home/live'), Tab.from('Schedule', 'home/schedule'), Tab.from('Agenda', 'home/agenda')]},

  { path:"home/schedule",  component: ScheduleComponent, title: 'Home (Schedule)',
    data: [Tab.from('Live', 'home/live'), Tab.from('Schedule', 'home/schedule'), Tab.from('Agenda', 'home/agenda')]},

  { path:"home/agenda",  component: AgendaComponent, title: 'Home (Agenda)',
    data: [Tab.from('Live', 'home/live'), Tab.from('Schedule', 'home/schedule'), Tab.from('Agenda', 'home/agenda')]},

  { path:"news",  component: NewsComponent, title: 'News' },

  { path:"people",  component: PeopleComponent, title: 'People',
    data: [Tab.from('All', 'people/all'), Tab.from('Board', 'people/board'), Tab.from('Search', 'people/search')]},

  { path:"people/all",  component: PeopleAllComponent, title: 'People (All)',
    data: [Tab.from('All', 'people/all'), Tab.from('Board', 'people/board'), Tab.from('Search', 'people/search')]},

  { path:"people/board",  component: PeopleBoardComponent, title: 'People (Board)',
    data: [Tab.from('All', 'people/all'), Tab.from('Board', 'people/board'), Tab.from('Search', 'people/search')]},

  { path:"people/search",  component: PeopleSearchComponent, title: 'People (Search)',
    data: [Tab.from('All', 'people/all'), Tab.from('Board', 'people/board'), Tab.from('Search', 'people/search')]},

  { path:"personal/:userName",  component: PersonalComponent, title: 'Personal - :userName' },
  { path:"chat",  component: ChatComponent, title: 'Chat', children: [
      { path:"politics", component: ChatBoxComponent, title: 'Chat > Politics' },
      { path:"people", component: ChatBoxComponent, title: 'Chat > People' },
      { path:"speed-running", component: ChatBoxComponent, title: 'Chat > Speed Running' },
      { path:"general", component: ChatBoxComponent, title: 'Chat > General' },
    ]
  },
  { path:"contact",  component: ContactComponent, title: 'Contact' },
  {
    path: '**', redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
