import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, LandingRoutingModule, MaterialModule],
})
export class LandingModule {}
