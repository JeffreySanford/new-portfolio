import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PeasantKitchenService } from '../peasant-kitchen.service';
import { Recipe } from '../recipe.class';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss'
})
export class RecipesComponent implements OnInit, OnDestroy, OnInit {
  recipes: Recipe[] = [];
  loaded = false;
  recipeSubscription!: Subscription;
  recipe!: Recipe;
  allRecipes = true;

  constructor(private peasantKitchenService: PeasantKitchenService, private router: Router) {}

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

  navigateToRecipe(recipe: Recipe): void {
    console.log('Navigating to recipe:', recipe);
    this.peasantKitchenService.setRecipe(recipe);
    this.router.navigate([`/peasant-kitchen/recipe/:${recipe.url}`]);
  }
}
