import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { SpaceVideoComponent } from './space-video.component';

@NgModule({
  declarations: [SpaceVideoComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
})
export class SpaceVideoModule {}
