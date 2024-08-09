import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { MaterialModule } from '../material.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingComponent],
      imports: [MaterialModule, HttpClientModule],
      providers: [HttpClient]
    }).compileComponents();
  
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});