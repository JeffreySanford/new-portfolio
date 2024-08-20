import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceVideoComponent } from './space-video.component';

describe('SpaceVideoComponent', () => {
  let component: SpaceVideoComponent;
  let fixture: ComponentFixture<SpaceVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
