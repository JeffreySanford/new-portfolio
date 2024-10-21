import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToasterComponent } from './toaster.component';
import { InjectionToken } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service';

export interface ToastConfig {
  duration: number;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  type: 'default' | 'success' | 'error' | 'info';
}

export const TOAST_CONFIG = new InjectionToken<ToastConfig>('TOAST_CONFIG');

describe('ToasterComponent', () => {
  let component: ToasterComponent;
  let fixture: ComponentFixture<ToasterComponent>;

  beforeEach(async () => {
    const mockToastrService = {
      success: jest.fn(),
      error: jest.fn(),
      clear: jest.fn()
    };

    const mockNotificationService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
      clear: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ToasterComponent],
      providers: [
        { provide: TOAST_CONFIG, useValue: { duration: 5000, position: 'top-right', type: 'default' } },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: NotificationService, useValue: mockNotificationService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});