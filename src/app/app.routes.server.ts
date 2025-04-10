import {RenderMode, ServerRoute} from '@angular/ssr';
import {NewsComponent} from './component/news.component';
import {PeopleComponent} from './component/people.component';
import {ChatComponent} from './component/chat.component';
import {HomeComponent} from './component/home.component';
import {ChatBoxComponent} from './component/chatbox.component';
import {CreateAccountComponent} from './component/create-account.component';

export const serverRoutes: ServerRoute[] = [
  { path:"login", renderMode: RenderMode.Client },
  { path:"create-account",  renderMode: RenderMode.Client },
  { path:"home",  renderMode: RenderMode.Client },
  { path:"news",  renderMode: RenderMode.Client },
  { path:"people",  renderMode: RenderMode.Client },
  { path:"personal/:userName",  renderMode: RenderMode.Client },
  { path:"chat",  renderMode: RenderMode.Client },
  { path:"chat/politics", renderMode: RenderMode.Client },
  { path:"chat/people", renderMode: RenderMode.Client },
  { path:"chat/speed-running", renderMode: RenderMode.Client },
  { path:"chat/general", renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
