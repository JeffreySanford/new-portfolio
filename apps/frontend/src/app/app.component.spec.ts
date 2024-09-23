import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockBreakpointObserver: jest.Mocked<BreakpointObserver>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn()
        }
      }
    } as unknown as jest.Mocked<ActivatedRoute>;

    mockBreakpointObserver = {
      observe: jest.fn()
    } as unknown as jest.Mocked<BreakpointObserver>;

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar correctly', () => {
    component.isCollapsed = false;
    component.toggleSidebar(true);
    expect(component.isCollapsed).toBe(true);

    component.toggleSidebar(true);
    expect(component.isCollapsed).toBe(false);
  });

  it('should add user interaction listeners', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    component['addUserInteractionListener']();
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', component['handleUserInteraction']);
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', component['handleUserInteraction']);
  });

  it('should remove user interaction listeners', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    component['removeUserInteractionListener']();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', component['handleUserInteraction']);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', component['handleUserInteraction']);
  });

  it('should handle user interaction', () => {
    const ensureVideoIsPlayingSpy = jest.spyOn(component as any, 'ensureVideoIsPlaying');
    component['handleUserInteraction']();
    expect(ensureVideoIsPlayingSpy).toHaveBeenCalled();
  });
});