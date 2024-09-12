import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RecipeComponent } from './recipe.component';
import { PeasantKitchenService } from '../peasant-kitchen.service';
import { Recipe } from '../recipe.class';

describe('RecipeComponent', () => {
  let component: RecipeComponent;
  let fixture: ComponentFixture<RecipeComponent>;
  let mockPeasantKitchenService: jest.Mocked<PeasantKitchenService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockPeasantKitchenService = {
      getRecipe: jest.fn()
    } as unknown as jest.Mocked<PeasantKitchenService>;

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [RecipeComponent],
      imports: [RouterTestingModule], // Import RouterTestingModule here
      providers: [
        { provide: PeasantKitchenService, useValue: mockPeasantKitchenService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize recipe on ngOnInit', () => {
    const mockRecipe: Recipe = { id: 1, name: 'Test Recipe', ingredients: [], directions: [''] };
    mockPeasantKitchenService.getRecipe.mockReturnValue(mockRecipe);

    component.ngOnInit();

    expect(component.recipe).toEqual(mockRecipe);
  });

  it('should navigate to /peasant-kitchen if recipe is not found', () => {
    const emptyRecipe: Recipe = { id: 0, name: '', ingredients: [], directions: [''] };
    mockPeasantKitchenService.getRecipe.mockReturnValue(emptyRecipe);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/peasant-kitchen']);
  });
});