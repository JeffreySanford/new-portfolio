import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { PeasantKitchenComponent } from './peasant-kitchen.component';
import { RecipeComponent } from './recipe/recipe.component';
import { PeasantKitchenService } from './peasant-kitchen.service';
import { RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';

@NgModule({
  declarations: [RecipeComponent, PeasantKitchenComponent, RecipesComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  providers: [PeasantKitchenService],
})
export class PeasantKitchenModule { }
