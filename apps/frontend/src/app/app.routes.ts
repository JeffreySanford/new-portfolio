import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { PeasantKitchenComponent } from './projects/peasant-kitchen/peasant-kitchen.component';
import { SpaceVideoComponent } from './projects/space-video/space-video.component';
import { TableComponent } from './projects/table/table.component';
import { DataVisualizationsComponent } from './projects/data-visualizations/data-visualizations.component';
import { MaterialIconsComponent } from './landing/material-icons/material-icons.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';

export const appRoutes: Routes = [
  { path: 'home', component: LandingComponent },
  { path: 'product', component: LandingComponent },
  { path: 'contact', component: LandingComponent },
  { path: 'about', component: LandingComponent },
  { path: 'table', component: TableComponent },
  { path: 'mat-icon', component: MaterialIconsComponent },
  { path: 'data-visualization', component: DataVisualizationsComponent},
  { path: 'peasant-kitchen', component: PeasantKitchenComponent },
  { path: 'space-video', component: SpaceVideoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];