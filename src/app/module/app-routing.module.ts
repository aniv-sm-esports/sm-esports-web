import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../component/home.component';
import {NewsComponent} from '../component/news.component';
import {PeopleComponent} from '../component/people.component';
import {ChatComponent} from '../component/chat.component';
import {RenderMode} from '@angular/ssr';
import {AppComponent} from '../component/app.component';

const routes: Routes = [
  { path:"home",  component: HomeComponent },
  { path:"news",  component: NewsComponent },
  { path:"people",  component: PeopleComponent },
  { path:"chat",  component: ChatComponent },
  {
    path: 'users/getAll', component: HomeComponent
  },
  {
    path: 'users/create/:userName', component: HomeComponent
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
