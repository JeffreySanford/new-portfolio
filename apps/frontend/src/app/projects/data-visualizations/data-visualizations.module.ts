import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileContainerComponent } from './tile-container/tile-container.component';
import { BarModule } from './tile-container/bar/bar.module';
import { LineModule } from './tile-container/line/line.module';
import { FintechModule } from './tile-container/fintech/fintech.module';
import { MapModule } from './tile-container/map/map.module';
import { DataVisualizationsComponent } from './data-visualizations.component';

@NgModule({
  declarations: [
    TileContainerComponent,
    DataVisualizationsComponent,
  ],
  imports: [CommonModule, BarModule, LineModule, FintechModule, MapModule],
  exports: [],
})
export class DataVisualizationsModule {}
