import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing.component'; // Ensure LandingComponent is imported
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    HeaderComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    MaterialModule
  ],
})
export class LandingModule {}
