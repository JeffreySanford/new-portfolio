import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './recipe.class';
import { NotificationService } from '../../common/services/notification.service';

@Injectable()
export class PeasantKitchenService {
  api = 'https://locahost:3000/recipes';
  recipe!: Recipe;

  constructor(private http: HttpClient, private notifyService: NotificationService) {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      this.api = 'https://jeffreysanford.us:3000/';
      this.notifyService.showSuccess('Running in production mode', 'Production');      
    } else {      
      this.notifyService.showSuccess('Running in development mode', 'Development');
    }
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.api);
  }

  setRecipe(recipe: Recipe): void {
    this.recipe = recipe;
  }

  getRecipe(): Recipe {
    return this.recipe;
  }
}