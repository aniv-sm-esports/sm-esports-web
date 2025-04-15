import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../component/view/home/home.component';
import {HomeNewsComponent} from '../component/view/home/home-news.component';
import {PeopleComponent} from '../component/view/people/people.component';
import {ChatComponent} from '../component/view/chat/chat.component';
import {ChatBoxComponent} from '../component/control/chatbox.component';
import {PersonalComponent} from '../component/view/personal.component';
import {LoginComponent} from '../component/control/login.component';
import {CreateAccountComponent} from '../component/create-account.component';
import {LiveComponent} from '../component/live.component';
import {HomeScheduleComponent} from '../component/view/home/home-schedule.component';
import {PeopleAllComponent} from '../component/view/people/people-all.component';
import {PeopleBoardComponent} from '../component/view/people/people-board.component';
import {PeopleSearchComponent} from '../component/view/people/people-search.component';
import {Tab} from '../model/tab.model';
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

export const routes: Routes = [
  { path:"login",  component: LoginComponent, title: 'Login'},
  { path:"create-account",  component: CreateAccountComponent, title: 'Create Account' },

  { path:"home", component: HomeComponent, title: 'Home',
    data: [Tab.from('News', 'home/news'), Tab.from('Schedule', 'home/schedule'), Tab.from('Online', 'home/online')]},

  { path:"home/news",  component: HomeNewsComponent, title: 'Home (News)',
    data: [Tab.from('News', 'home/news'), Tab.from('Schedule', 'home/schedule'), Tab.from('Online', 'home/online')]},

  { path:"home/schedule",  component: HomeScheduleComponent, title: 'Home (Schedule)',
    data: [Tab.from('News', 'home/news'), Tab.from('Schedule', 'home/schedule'), Tab.from('Online', 'home/online')]},

  { path:"home/online",  component: HomeOnlineComponent, title: 'Home (Online)',
    data: [Tab.from('News', 'home/news'), Tab.from('Schedule', 'home/schedule'), Tab.from('Online', 'home/online')]},

  { path:"people",  component: PeopleComponent, title: 'People',
    data: [Tab.from('All', 'people/all'), Tab.from('Board', 'people/board'), Tab.from('Search', 'people/search')]},

  { path:"people/all",  component: PeopleAllComponent, title: 'People (All)',
    data: [Tab.from('All', 'people/all'), Tab.from('Board', 'people/board'), Tab.from('Search', 'people/search')]},

  { path:"people/board",  component: PeopleBoardComponent, title: 'People (Board)',
    data: [Tab.from('All', 'people/all'), Tab.from('Board', 'people/board'), Tab.from('Search', 'people/search')]},

  { path:"people/search",  component: PeopleSearchComponent, title: 'People (Search)',
    data: [Tab.from('All', 'people/all'), Tab.from('Board', 'people/board'), Tab.from('Search', 'people/search')]},

  { path:"collab",  component: CollabComponent, title: 'Collab',
    data: [Tab.from('Statement', 'collab/statement'), Tab.from('Guide', 'collab/guide'), Tab.from('Documents', 'collab/documents')]},

  { path:"collab/statement",  component: CollabStatementComponent, title: 'Collab',
    data: [Tab.from('Statement', 'collab/statement'), Tab.from('Guide', 'collab/guide'), Tab.from('Documents', 'collab/documents')]},

  { path:"collab/guide",  component: CollabGuideComponent, title: 'Collab',
    data: [Tab.from('Statement', 'collab/statement'), Tab.from('Guide', 'collab/guide'), Tab.from('Documents', 'collab/documents')]},

  { path:"collab/documents",  component: CollabDocumentsComponent, title: 'Collab',
    data: [Tab.from('Statement', 'collab/statement'), Tab.from('Guide', 'collab/guide'), Tab.from('Documents', 'collab/documents')]},

  { path:"landscape",  component: LandscapeComponent, title: 'Landscape',
    data: [Tab.from('Media', 'landscape/media'), Tab.from('Wiki', 'landscape/wiki'), Tab.from('Links', 'landscape/links')]},

  { path:"landscape/media",  component: LandscapeMediaComponent, title: 'Media',
    data: [Tab.from('Media', 'landscape/media'), Tab.from('Wiki', 'landscape/wiki'), Tab.from('Links', 'landscape/links')]},

  { path:"landscape/wiki",  component: LandscapeWikiComponent, title: 'Wiki',
    data: [Tab.from('Media', 'landscape/media'), Tab.from('Wiki', 'landscape/wiki'), Tab.from('Links', 'landscape/links')]},

  { path:"landscape/links",  component: LandscapeLinksComponent, title: 'Links',
    data: [Tab.from('Media', 'landscape/media'), Tab.from('Wiki', 'landscape/wiki'), Tab.from('Links', 'landscape/links')]},

  { path:"personal/:userName",  component: PersonalComponent, title: 'Personal - :userName' },
  { path:"chat",  component: ChatComponent, title: 'Chat', children: [
      { path:"politics", component: ChatBoxComponent, title: 'Chat > Politics' },
      { path:"people", component: ChatBoxComponent, title: 'Chat > People' },
      { path:"speed-running", component: ChatBoxComponent, title: 'Chat > Speed Running' },
      { path:"general", component: ChatBoxComponent, title: 'Chat > General' },
    ]
  },
  { path:"contact",  component: ContactComponent, title: 'Contact' },
  { path:"live",  component: LiveComponent, title: 'Live' },
  {
    path: '**', redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
