import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
  },
  { path: 'home', component: LandingComponent },
  { path: 'product', component: LandingComponent },
  { path: 'contact', component: LandingComponent },
  { path: 'about', component: LandingComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];