import {RenderMode, ServerRoute} from '@angular/ssr';
import {NewsComponent} from './component/news.component';
import {PeopleComponent} from './component/people.component';
import {ChatComponent} from './component/chat.component';

export const serverRoutes: ServerRoute[] = [
  { path:"home",  renderMode: RenderMode.Server },
  { path:"news",  renderMode: RenderMode.Server },
  { path:"people",  renderMode: RenderMode.Server },
  { path:"chat",  renderMode: RenderMode.Server },
  {
    path: 'users/getAll',
    renderMode: RenderMode.Client,
  },
  {
    path: 'users/create/:userName',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
