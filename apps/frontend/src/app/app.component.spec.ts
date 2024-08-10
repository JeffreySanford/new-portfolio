import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterceptorService } from './common/interceptors/http-interceptor.service';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

describe('AppComponent', () => {
  beforeEach((done) => {
    from(TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      declarations: [AppComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
      ]
    }).compileComponents()).pipe(
      switchMap(() => from(Promise.resolve()))
    ).subscribe({
      next: () => done(),
      error: (err) => done.fail(err)
    });
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome frontend'
    );
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });
});