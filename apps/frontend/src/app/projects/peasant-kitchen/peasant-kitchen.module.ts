import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { PeasantKitchenComponent } from './peasant-kitchen.component';
import { RecipeComponent } from './recipe/recipe.component';
import { PeasantKitchenService } from './peasant-kitchen.service';

@NgModule({
  declarations: [RecipeComponent, PeasantKitchenComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [PeasantKitchenService],
})
export class PeasantKitchenModule { }
