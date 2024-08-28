import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataVisualizationsComponent } from './data-visualizations.component';

describe('DataVisualizationsComponent', () => {
  let component: DataVisualizationsComponent;
  let fixture: ComponentFixture<DataVisualizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataVisualizationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataVisualizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
