export class Recipe {
  name!: string;
  description?: string;
  countryOfOrigin!: string;
  ingredients!: string[];
  directions!: string[];
  url: string = '';
}
