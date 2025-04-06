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
  { path:"personal/:userName",  renderMode: RenderMode.Server },
  { path:"chat",  renderMode: RenderMode.Client },
  { path:"chat/politics", renderMode: RenderMode.Client },
  { path:"chat/people", renderMode: RenderMode.Client },
  { path:"chat/speed-running", renderMode: RenderMode.Client },
  { path:"chat/general", renderMode: RenderMode.Client },
  { path: 'users/getAll', renderMode: RenderMode.Client },
  { path: 'users/create/:userName', renderMode: RenderMode.Client },
  { path: 'news/getAll', renderMode: RenderMode.Client },
  { path: 'news/create', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
