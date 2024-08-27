import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { from } from 'rxjs';
import { catchError } from 'rxjs/operators';

const bootstrap$ = from(
  platformBrowserDynamic().bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
).pipe(
  catchError((err) => {
    console.error(err);
    return [];
  })
);

bootstrap$.subscribe();
