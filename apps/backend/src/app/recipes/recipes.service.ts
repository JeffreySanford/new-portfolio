import { Injectable } from '@nestjs/common';

interface Recipe {
  name: string;
  countryOfOrigin: string;
  description: string;
  ingredients: string[];
  directions: string[];
  servingSize?: string;
  url: string;
  history?: string[];
}

@Injectable()
export class RecipesService {
  private readonly recipes: Recipe[] = [
    {
      "url": "fresh-tomato-soup",
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
    {
      "url": "kartoffelsalat",
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
    },
    {
      "url": "german-speatzle-dumplings",
      "name": "German Spätzle Dumplings",
      "countryOfOrigin": "Germany",
      "description": "These are traditional German dumplings that are super tasty. They are different than the dumplings we see in American or Chinese cooking. They make a wonder quick side-dish to a German meal or anytime. For an extra tasty treat, skip the butter and use few pieces of bacon and the bacon grease that it produces! Mahlzeit!",
      "ingredients": [
        "1 cup all-purpose flour",
        "1/4 cup milk",
        "2 eggs",
        "1/2 teaspoon ground nutmeg",
        "1 pinch freshly ground white pepper",
        "1/2 teaspoon salt",
        "1 gallon hot water",
        "2 tablespoons butter",
        "2 tablespoons chopped fresh parsley"
      ],
      "directions": [
        "Mix together flour, salt, white pepper, and nutmeg. Beat eggs well, and add alternately with the milk to the dry ingredients. Mix until smooth.",
        "Press dough through spaetzle maker, or a large holed sieve or metal grater.",
        "Drop a few at a time into simmering liquid. Cook 5 to 8 minutes. Drain well.",
        "Saute cooked spaetzle in butter or margarine. Sprinkle chopped fresh parsley on top, and serve."
      ]
    },
    {
      "url": "jamaican-jerk",
      "name": "Jamaican Jerk",
      "countryOfOrigin": "Jamaica",
      "description": "Jerk is a style of cooking native to Jamaica in which meats are dry-rubbed or wet marinated with a very hot spice mixture called Jamaican jerk spice. Jerk seasoning is traditionally applied to pork and chicken. Modern recipes also apply jerk spice mixes to fish, shrimp, shellfish, beef, sausage, and tofu.",
      "ingredients": [
        "1 big bunch of green onions or a couple smaller bunches",
        "2 tbsp soy sauce",
        "2 tbsp vegetable oil",
        "1 tbsp salt",
        "Juice of 1 lime",
        "1/2 tsp dried thyme, or 1 tablespoon fresh thyme",
        "1 tbsp allspice",
        "1-10 scotch bonnets (traditional - I use jalapeno all the time with great success)."
      ],
      "history": [
        "The recipes I have included here for jerked meats and poultry are not the authentic jerk recipes as they were handed down from the very old times. Before their enslavement and transportation to far off lands, the Cormantee hunters of West Africa used this to preserve their meats they collected on their hunts. This would have extended the duration the meat was viable as food, plus adding to the spiciness and flavor of the meat. Modern people, checking their mobile phone for FDA recalls on food products would be appalled at the way meat was cured in the past yet these old way were extremely affective in keep meats weeks if not months into the future.",
        "To keep their pork and chicken in the warm Caribbean islands, the use the method of jerking meats, turning them into jerky which extends shelf life by removing most of the water and fat from the meat. Bacteria that are common in meats required water to exist. In the jerky process these components are removed, no water, no fat, no bugs, just tasty meat. The term jerk is said to come from the word charqui, a Spanish term for jerked or dried meat, which eventually became jerky in English. In my best American accent, 'Did he say jher-key, it sure is tasty whatever it is.'",
        "Due to influences of the world throughout jamaican history the last 300 years; the flavors of the British, Dutch, French, Spanish, East Indian, West African, Portuguese and Chinese, added to the falor that Jamacia had developed as its own. On the little island of Jamaica, bathed in the waters of the warm Caribbean seas, smells of allspice and other spices along with grilling meats and birds, waft through the air to this day.",
        "Jamaica allspice is a topic all to its own, wonderfully aromatic it is the heart of the Jamaican jerk aroma. With indigenous plant, the Mayan indigenous used to send their leaders off into the next world. It certainly has a divinity quality and will impart a wonderfully rich flavor into your meats. Jamaican allspice goes well with black pepper, bourbon, cardamom, cinnamon, cloves, coriander, cumin, fennel seed, ginger, nutmeg, orange and vanilla.",
        "Origins of this wonderful marinade and rub traces their roots back to the days on the west African plains, food dried by Maroon hunters, long into the distant past before their enslavement and displacement in 1655. Jamaica has a very rich and wonderful culture, a world-renowned tourist destination, as well as music that literally changed the word. In recent years our Jamaican brothers and sister have have had hard times still fighting for their own personal freedoms. I hope you remember to think of them as you treat your pork or chicken to some amazing flavors."
      ],
      "directions": [
        "Boil your pork ribs or chicken for 20 minutes and let cool before introducing the marinade. I like to use zip-lock plastic freezer bags to keep the mess down.",
        "Combine all other the ingredients in a bowl and transfer to the cooled meat. Combine all these ingredients, into a plastic bag preferably and marinate a cut up chicken or rack of pork ribs for a delicious meal. Marinate for at least 8 hours up to 24 hours to really permeate the flavor into the meat or poultry. Be very careful, this dish is very hot, adjust it accordingly for you favorite spiciness level. Use the lime halves for barbecuing, placing them on top of the meat to allow more of an indirect heat.",
        "Barbecue your meats at least an hour over a medium indirect heat. I prefer the the meats and poultry are blackened well, the darker the best but most find a bitterness in the taste. Either way the herb mixture, mixed with the fire, releases a wonderful smoke that will flavor your dish."
      ]
    },
    {
      "url": "torsk",
      "name": "Torsk",
      "countryOfOrigin": "Scandahovia",
      "description": "Known as poor man's lobster, dipped in butter this is super tasty!",
      "ingredients": [
        "6 (6 ounce) fillets cod",
        "6 cups water",
        "1 cup white sugar",
        "2 tablespoons salt",
        "1 1/2 cups butter, melted"
      ],
      "directions": [
        "Preheat broiler. Lightly grease a cookie sheet.",
        "Place the fish in a large saucepan. Mix together the water, sugar, and salt. Pour the water-mixture over the fish. The water-mixture should fully cover the fish, if it doesn't add more water. Bring the water to a boil over a medium-high heat. Boil for 3 to 5 minutes.",
        "Remove fillets from water, and blot on paper towels to remove excess water. Brush with 6 tablespoons melted butter, and sprinkle with paprika.",
        "Broil for 8 to 10 minutes per inch of thickness, or until the fillets are golden brown. Serve with the remaining melted butter"
      ]
    }
  ];

  getAllRecipes() {
    return this.recipes;
  }

  getRecipeByUrl(url: string) {
    return this.recipes.find(recipe => recipe.url === url);
  }
}