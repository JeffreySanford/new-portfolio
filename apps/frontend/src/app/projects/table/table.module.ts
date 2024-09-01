import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordListComponent } from './record-list-component';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { RecordService } from './record.service';
import { MaterialModule } from '../../material.module';
import { EmploymentIncomePipe } from './pipes/employment-income.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RecordListComponent, RecordDetailComponent, EmploymentIncomePipe],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    RecordListComponent,
    RecordDetailComponent,
    EmploymentIncomePipe
  ],
  providers: [
    RecordService
  ],
})
export class TableModule { }
