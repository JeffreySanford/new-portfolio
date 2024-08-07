import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  exports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
  ]
})
export class MaterialModule { }