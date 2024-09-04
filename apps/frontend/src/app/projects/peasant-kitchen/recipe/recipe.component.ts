import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../recipe.class';
import { PeasantKitchenService } from '../peasant-kitchen.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  recipe!: Recipe;

  constructor(private recipeService: PeasantKitchenService, private router: Router) { }

  ngOnInit(): void {
    this.recipe = this.recipeService.getRecipe();
    if (!this.recipe) {
      this.router.navigate(['/peasant-kitchen']);
    }
  }
}