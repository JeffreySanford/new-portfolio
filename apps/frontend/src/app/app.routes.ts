import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

export const appRoutes: Routes = [
  { path: 'home', component: LandingComponent },
  { path: 'product', component: LandingComponent },
  { path: 'contact', component: LandingComponent },
  { path: 'about', component: LandingComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];