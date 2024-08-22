import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MaterialModule } from '../../material.module';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    MaterialModule,
    CommonModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
