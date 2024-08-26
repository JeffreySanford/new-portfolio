import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordListComponent } from './record-list-component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { MaterialModule } from '../../../../material.module';

describe('RecordListComponentComponent', () => {
  let component: RecordListComponent;
  let fixture: ComponentFixture<RecordListComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [RecordListComponent, RecordDetailComponent],
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
