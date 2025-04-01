import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/module/app.module';

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
