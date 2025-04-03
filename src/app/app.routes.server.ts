import {RenderMode, ServerRoute} from '@angular/ssr';
import {NewsComponent} from './component/news.component';
import {PeopleComponent} from './component/people.component';
import {ChatComponent} from './component/chat.component';
import {HomeComponent} from './component/home.component';
import {ChatBoxComponent} from './component/chatbox.component';

export const serverRoutes: ServerRoute[] = [
  { path:"home",  renderMode: RenderMode.Server },
  { path:"news",  renderMode: RenderMode.Server },
  { path:"people",  renderMode: RenderMode.Server },
  { path:"chat",  renderMode: RenderMode.Server },
  { path:"chat/politics", renderMode: RenderMode.Server },
  { path:"chat/people", renderMode: RenderMode.Server },
  { path:"chat/speed-running", renderMode: RenderMode.Server },
  { path:"chat/general", renderMode: RenderMode.Server },
  { path: 'users/getAll', renderMode: RenderMode.Client },
  { path: 'users/create/:userName', renderMode: RenderMode.Client },
  { path: 'news/getAll', renderMode: RenderMode.Client },
  { path: 'news/create', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
