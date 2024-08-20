import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { MaterialModule } from '../../material.module';



@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
