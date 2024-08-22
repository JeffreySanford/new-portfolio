import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { appRoutes } from '../app.routes';
import { MastheadModule } from '../masthead/masthead.module';
import { MaterialModule } from '../material.module';
import { RecordDetailComponent } from './record-list/record-detail/record-detail.component';
import { RecordListComponent } from './record-list/record-list-component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterModule.forRoot(appRoutes),MastheadModule, MaterialModule, FormsModule, BrowserAnimationsModule],
      declarations: [AppComponent, LandingComponent, RecordListComponent, RecordDetailComponent],
      providers: [
        provideAnimationsAsync()
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
