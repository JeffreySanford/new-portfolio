import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from './recipe.class';

@Component({
  selector: 'app-peasant-kitchen',
  templateUrl: './peasant-kitchen.component.html',
  styleUrls: ['./peasant-kitchen.component.scss'],
})
export class PeasantKitchenComponent implements OnInit, OnDestroy {
  // private portfolioAPI =
  // 'https://api-portfolio-65p75.ondigitalocean.app/recipes';
  private portfolioAPI = 'http://jeffreysanford.us:3000/recipes';
  recipes!: Recipe[];
  color = 'white';
  loaded = false;
  siteSections = ['landing', 'recipes', 'history', 'contact'];
  active = 0;
  recipeSubscription: any;
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
