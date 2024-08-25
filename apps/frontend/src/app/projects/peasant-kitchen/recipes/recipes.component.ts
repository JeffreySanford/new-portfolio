import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.class';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  @Input() public recipe!: Recipe;
  constructor() {}

  ngOnInit(): void {}
}
