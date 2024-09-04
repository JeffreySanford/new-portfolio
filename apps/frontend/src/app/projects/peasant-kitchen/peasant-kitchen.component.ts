import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from './recipe.class';
import { PeasantKitchenService } from './peasant-kitchen.service';

@Component({
  selector: 'app-peasant-kitchen',
  templateUrl: './peasant-kitchen.component.html',
  styleUrls: ['./peasant-kitchen.component.scss'],
})
export class PeasantKitchenComponent implements OnInit, OnDestroy {
  recipes!: Recipe[];
  loaded = false;
  recipeSubscription!: Subscription;
  recipe!: Recipe;
  allRecipes = true;

  constructor(private peasantKitchenService: PeasantKitchenService) {}

  ngOnDestroy() {
    if (this.recipeSubscription) {
      this.recipeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.recipeSubscription = this.peasantKitchenService.getRecipes().subscribe({
      next: (recipes: Recipe[]) => {
        this.recipes = recipes;
        this.loaded = true;
      },
      error: (err) => {
        console.error('Error fetching recipes:', err);
        this.loaded = false;
      },
      complete: () => {
        console.log('Recipe fetch complete');
      }
    });
  }

  showRecipe(recipe: Recipe) {
    this.allRecipes = false;
    this.recipe = recipe;
  }
}