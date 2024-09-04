import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from './recipe.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-peasant-kitchen',
  templateUrl: './peasant-kitchen.component.html',
  styleUrls: ['./peasant-kitchen.component.scss'],
})
export class PeasantKitchenComponent implements OnInit, OnDestroy {
  private portfolioAPI = 'http://localhost:3000/recipes';
  recipes!: Recipe[];
  color = 'white';
  loaded = true;
  siteSections = ['landing', 'recipes', 'history', 'contact'];
  active = 0;
  recipeSubscription!: Subscription;
  recipe!: Recipe;
  allRecipes = true;

  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    if (this.recipeSubscription) {
      this.recipeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.recipeSubscription = this.http
      .get<Recipe[]>(this.portfolioAPI)
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
        this.loaded = true;
      });
  }

  onTabChange(tabIndex: number) {
    console.log(tabIndex);
  }

  showRecipe(recipe: Recipe) {
    this.allRecipes = false;
    this.recipe = recipe;
  }
}
