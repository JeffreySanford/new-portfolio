import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordDetailComponent } from './record-detail.component';
import { MaterialModule } from '../../../material.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from '../../../app.routes';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecordListComponent } from '../record-list-component';
import { RecordService } from '../record.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationService } from '../../../common/services/notification.service';

describe('RecordDetailComponent', () => {
    let component: RecordDetailComponent;
    let fixture: ComponentFixture<RecordDetailComponent>;
    let mockNotificationService: Partial<NotificationService>;
  
    beforeEach(async () => {
      mockNotificationService = {
        clear: jest.fn(),
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showHTMLMessage: jest.fn()
      };
  
      await TestBed.configureTestingModule({
        imports: [
          RouterModule.forRoot(appRoutes),
          MaterialModule,
          FormsModule,
          BrowserAnimationsModule,
          HttpClientTestingModule
        ],
        declarations: [RecordListComponent, RecordDetailComponent],
        providers: [
          RecordService,
          { provide: NotificationService, useValue: mockNotificationService }
        ],
      }).compileComponents();
    
    fixture = TestBed.createComponent(RecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
