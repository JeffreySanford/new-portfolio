import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PeasantKitchenComponent } from './projects/peasant-kitchen/peasant-kitchen.component';
import { SpaceVideoComponent } from './projects/space-video/space-video.component';
import { TableComponent } from './projects/table/table.component';
import { DataVisualizationsComponent } from './projects/data-visualizations/data-visualizations.component';
import { MaterialIconsComponent } from './pages//landing/material-icons/material-icons.component';

export const appRoutes: Routes = [
  { path: 'home', component: LandingComponent },
  { path: 'product', component: LandingComponent },
  { path: 'contact', component: LandingComponent },
  { path: 'about', component: LandingComponent },
  { path: 'table', component: TableComponent },
  { path: 'mat-icon', component: MaterialIconsComponent },
  { path: 'data-visualizations', component: DataVisualizationsComponent},
  { path: 'peasant-kitchen', component: PeasantKitchenComponent },
  { path: 'space-video', component: SpaceVideoComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];