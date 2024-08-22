import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordListComponent } from './record-list-component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component';
import { appRoutes } from '../../app.routes';
import { MastheadModule } from '../../masthead/masthead.module';
import { LandingComponent } from '../landing.component';
import { RecordDetailComponent } from './record-detail/record-detail.component';

describe('RecordListComponentComponent', () => {
  let component: RecordListComponent;
  let fixture: ComponentFixture<RecordListComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterModule.forRoot(appRoutes),MastheadModule, MaterialModule, FormsModule, BrowserAnimationsModule],
      declarations: [AppComponent, LandingComponent, RecordListComponent, RecordDetailComponent],
      providers: [
        provideAnimationsAsync()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
