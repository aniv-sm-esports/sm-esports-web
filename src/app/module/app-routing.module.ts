import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../component/view/home/home.component';
import {HomeNewsComponent} from '../component/view/home/home-news.component';
import {PeopleComponent} from '../component/view/people/people.component';
import {ChatComponent} from '../component/view/chat/chat.component';
import {PersonalComponent} from '../component/view/personal.component';
import {LoginComponent} from '../component/control/login.component';
import {CreateAccountComponent} from '../component/create-account.component';
import {LiveComponent} from '../component/live.component';
import {HomeScheduleComponent} from '../component/view/home/home-schedule.component';
import {PeopleAllComponent} from '../component/view/people/people-all.component';
import {PeopleBoardComponent} from '../component/view/people/people-board.component';
import {PeopleSearchComponent} from '../component/view/people/people-search.component';
import {ContactComponent} from '../component/contact.component';
import {HomeOnlineComponent} from '../component/view/home/home-online.component';
import { CollabComponent } from '../component/view/collab/collab.component';
import { CollabStatementComponent } from '../component/view/collab/collab-statement.component';
import { CollabGuideComponent } from '../component/view/collab/collab-guide.component';
import {CollabDocumentsComponent} from '../component/view/collab/collab-documents.component';
import {LandscapeComponent} from '../component/view/landscape/landscape.component';
import {LandscapeMediaComponent} from '../component/view/landscape/landscape-media.component';
import { LandscapeWikiComponent } from '../component/view/landscape/landscape-wiki.component';
import {LandscapeLinksComponent} from '../component/view/landscape/landscape-links.component';
import {ChatSecurityComponent} from '../component/view/chat/chat-security.component';
import {ChatManagementComponent} from '../component/view/chat/chat-management.component';

export const routes: Routes = [
  { path:"login",  component: LoginComponent, title: 'Login'},
  { path:"create-account",  component: CreateAccountComponent, title: 'Create Account' },

  { path:"home", component: HomeComponent, title: 'Home', children: [
      { path:"live",  component: LiveComponent, title: 'Live' },
      { path:"news",  component: HomeNewsComponent, title: 'Home (News)'},
      { path:"schedule",  component: HomeScheduleComponent, title: 'Home (Schedule)'},
      { path:"online",  component: HomeOnlineComponent, title: 'Home (Online)'},
    ]},

  { path:"people",  component: PeopleComponent, title: 'People', children: [
      { path:"all",  component: PeopleAllComponent, title: 'People (All)'},
      { path:"board",  component: PeopleBoardComponent, title: 'People (Board)'},
      { path:"search",  component: PeopleSearchComponent, title: 'People (Search)'}
    ]},

  { path:"collab",  component: CollabComponent, title: 'Collab', children: [
    { path:"statement",  component: CollabStatementComponent, title: 'Collab'},
    { path:"guide",  component: CollabGuideComponent, title: 'Collab'},
    { path:"documents",  component: CollabDocumentsComponent, title: 'Collab'},
  ]},

  { path:"landscape",  component: LandscapeComponent, title: 'Landscape', children: [
      { path:"media",  component: LandscapeMediaComponent, title: 'Media'},
      { path:"wiki",  component: LandscapeWikiComponent, title: 'Wiki'},
      { path:"links",  component: LandscapeLinksComponent, title: 'Links'},
    ]},

  { path:"chat",  component: ChatComponent, title: 'Chat', children: [
      { path:"chatRooms",  component: ChatComponent, title: 'Chat (Public / Private)'},
      { path:"management",  component: ChatManagementComponent, title: 'Chat (Management)'},
      { path:"security",  component: ChatSecurityComponent, title: 'Chat (Security)'},
    ]},

  { path:"personal/:userName",  component: PersonalComponent, title: 'Personal - :userName' },
  { path:"contact",  component: ContactComponent, title: 'Contact' },
  {
    path: '**', redirectTo: '/home/news'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
