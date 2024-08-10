import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { MaterialModule } from '../material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorService } from '../common/interceptors/http-interceptor.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(() => {
    // Mock SpeechRecognition API
    const mockSpeechRecognition = jest.fn().mockImplementation(() => ({
      start: jest.fn(),
      onresult: jest.fn(),
      lang: ''
    }));
    (window as any).SpeechRecognition = (window as any).SpeechRecognition || mockSpeechRecognition;

    TestBed.configureTestingModule({
      declarations: [LandingComponent],
      imports: [MaterialModule, HttpClientModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});