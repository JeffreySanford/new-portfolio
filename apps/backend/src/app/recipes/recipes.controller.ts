import { Controller, Get, Param } from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  getAllRecipes() {
    return this.recipesService.getAllRecipes();
  }

  @Get(':url')
  getRecipeByUrl(@Param('url') url: string) {
    return this.recipesService.getRecipeByUrl(url);
  }
}