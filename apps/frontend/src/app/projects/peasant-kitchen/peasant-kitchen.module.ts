import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { PeasantKitchenComponent } from './peasant-kitchen.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipesComponent } from './recipes/recipes.component';

@NgModule({
  declarations: [RecipeComponent, RecipesComponent, PeasantKitchenComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class PeasantKitchenModule { }
