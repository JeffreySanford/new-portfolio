import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { MaterialModule } from '../../material.module';
import { MaterialIconsComponent } from './material-icons/material-icons.component';

@NgModule({
  declarations: [
    LandingComponent,
    MaterialIconsComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    MaterialModule
  ],
  exports: [
    MaterialModule
  ],
  providers: []
})

export class LandingModule {}
