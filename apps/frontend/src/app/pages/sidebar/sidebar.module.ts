import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { MaterialModule } from '../../material.module';
import { LandingRoutingModule } from '../landing/landing-routing.module';

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LandingRoutingModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
