import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeasantKitchenComponent } from './peasant-kitchen.component';

describe('PeasantKitchenComponent', () => {
  let component: PeasantKitchenComponent;
  let fixture: ComponentFixture<PeasantKitchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeasantKitchenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeasantKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
