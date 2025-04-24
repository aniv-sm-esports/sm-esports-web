import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path:"login", renderMode: RenderMode.Client },
  { path:"create-account",  renderMode: RenderMode.Client },
  { path:"home",  renderMode: RenderMode.Client },
  { path:"home/news",  renderMode: RenderMode.Client },
  { path:"people",  renderMode: RenderMode.Client },
  { path:"personal/:userName",  renderMode: RenderMode.Client },
  { path:"chat",  renderMode: RenderMode.Client },
  { path:"chat/chatRooms", renderMode: RenderMode.Client },
  { path:"chat/management", renderMode: RenderMode.Client },
  { path:"chat/security", renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
