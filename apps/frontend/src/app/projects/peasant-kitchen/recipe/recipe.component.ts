import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.class';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  @Input() public recipe!: Recipe;
  constructor() {}

  ngOnInit(): void {}
}
