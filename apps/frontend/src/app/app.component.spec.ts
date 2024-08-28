import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SidebarModule } from './pages/sidebar/sidebar.module';

describe('AppComponent', () => {
  beforeEach((done) => {
    from(TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        SidebarModule
    
      ],
      declarations: [AppComponent],
      providers: [
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
      'frontend'
    );
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });
});