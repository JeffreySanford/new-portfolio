import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from './recipe.class';
import { PeasantKitchenService } from './peasant-kitchen.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-peasant-kitchen',
  templateUrl: './peasant-kitchen.component.html',
  styleUrls: ['./peasant-kitchen.component.scss'],
})
export class PeasantKitchenComponent {

}