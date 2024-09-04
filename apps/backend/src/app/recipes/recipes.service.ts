import { Injectable } from '@nestjs/common';

interface Recipe {
  name: string;
  countryOfOrigin: string;
  description: string;
  ingredients: string[];
  directions: string[];
  servingSize?: string;
}

@Injectable()
export class RecipesService {
  private readonly recipes: { [key: string]: Recipe } = {
    "fresh-tomato-soup": {
      "name": "Fresh Tomato Soup",
      "countryOfOrigin": "United States of America",
      "description": "Bright and fresh tomato soup with a hint of spice.",
      "ingredients": [
        "3 medium tomatoes, peeled and quartered",
        "1 1/2 cups water",
        "1/2 cup chopped onion (1 medium)",
        "1/2 cup chopped celery (1 stalk)",
        "1/2 6 ounce can (1/3 cup) tomato paste",
        "2 tablespoons snipped fresh cilantro or basil",
        "2 teaspoons instant chicken bouillon granules",
        "1 teaspoon sugar(optional)",
        "Few dashes bottled hot pepper sauce",
        "Snipped fresh cilantro or basil (optional)"
      ],
      "directions": [
        "If desired, seed the tomatoes. In a large saucepan combine tomatoes, water, onion, celery, tomato paste, the 2 tablespoons cilantro, bouillon granules, sugar, and hot pepper sauce. Bring to boiling; reduce heat. Simmer, covered, about 20 minutes or until celery and onion are very tender. Remove from heat and cool for 10 minutes.",
        "Place half of the tomato mixture in a blender or food processor. Cover and blend or process until smooth. Repeat with the remaining mixture. Return all to the saucepan; heat through. If desired, garnish with additional cilantro."
      ],
      "servingSize": "4 servings (4 cups)"
    },
    "kartoffelsalat": {
      "name": "German Potato Salad",
      "countryOfOrigin": "Germany",
      "description": "Authentic german potato sales, warm a savory.",
      "ingredients": [
        "3 cups diced peeled potatoes",
        "4 slices bacon",
        "1 small onion, diced",
        "1/4 cup white vinegar",
        "2 tablespoons water",
        "3 tablespoons white sugar",
        "1 teaspoon salt",
        "1/8 teaspoon ground black pepper"
      ],
      "directions": [
        "Place the potatoes into a pot, and fill with enough water to cover. Bring to a boil, and cook for about 10 minutes, or until easily pierced with a fork. Drain, and set aside to cool.",
        "Place the bacon in a large deep skillet over medium-high heat. Fry until browned and crisp, turning as needed. Remove from the pan and set aside.",
        "Add onion to the bacon grease, and cook over medium heat until browned. Add the vinegar, water, sugar, salt and pepper to the pan. Bring to a boil, then add the potatoes and parsley. Crumble in half of the bacon. Heat through, then transfer to a serving dish. Crumble the remaining bacon over the top, and serve warm."
      ]
    }
  };

  getAllRecipes() {
    return this.recipes;
  }

  getRecipeByUrl(url: string) {
    return this.recipes[url];
  }
}