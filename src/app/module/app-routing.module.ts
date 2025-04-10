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

const routes: Routes = [
  { path:"login",  component: LoginComponent },
  { path:"create-account",  component: CreateAccountComponent },
  { path:"home",  component: HomeComponent },
  { path:"news",  component: NewsComponent },
  { path:"people",  component: PeopleComponent },
  { path:"personal/:userName",  component: PersonalComponent },
  { path:"chat", component: ChatComponent, children: [
      { path:"politics", component: ChatBoxComponent },
      { path:"people", component: ChatBoxComponent },
      { path:"speed-running", component: ChatBoxComponent },
      { path:"general", component: ChatBoxComponent }
    ]
  },
  {
    path: '**', redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
