import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PeasantKitchenComponent } from './projects/peasant-kitchen/peasant-kitchen.component';
import { SpaceVideoComponent } from './projects/space-video/space-video.component';
import { DataVisualizationsComponent } from './projects/data-visualizations/data-visualizations.component';
import { RecordListComponent} from './projects/table/record-list-component';
import { RecordDetailComponent } from './projects/table/record-detail/record-detail.component';
import { MaterialIconsComponent } from './pages//landing/material-icons/material-icons.component';

export const appRoutes: Routes = [
  { path: 'home', component: LandingComponent },
  { path: 'table', component: RecordListComponent },
  { path: 'table/:id', component: RecordDetailComponent },
  { path: 'mat-icon', component: MaterialIconsComponent },
  { path: 'data-visualizations', component: DataVisualizationsComponent},
  { path: 'peasant-kitchen', component: PeasantKitchenComponent },
  { path: 'space-video', component: SpaceVideoComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];