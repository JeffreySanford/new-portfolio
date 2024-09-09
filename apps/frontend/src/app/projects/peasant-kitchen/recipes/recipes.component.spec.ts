import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecipesComponent } from './recipes.component';
import { PeasantKitchenService } from '../peasant-kitchen.service';
import { MaterialModule } from '../../../material.module';


describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipesComponent],
      imports: [HttpClientTestingModule, MaterialModule],
      providers: [PeasantKitchenService]  
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
