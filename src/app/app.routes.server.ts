import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path:"login", renderMode: RenderMode.Client },
  { path:"create-account",  renderMode: RenderMode.Client },
  { path:"home",  renderMode: RenderMode.Client },
  { path:"home/news",  renderMode: RenderMode.Client },
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
