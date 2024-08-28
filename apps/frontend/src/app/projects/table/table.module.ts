import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { RecordListComponent } from './table/record-list/record-list-component';
import { RecordService } from './table/record-list/record.service';
import { MaterialModule } from '../../material.module';
import { RecordDetailComponent } from './table/record-list/record-detail/record-detail.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TableComponent, RecordListComponent, RecordDetailComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [TableComponent, RecordListComponent, RecordDetailComponent],
  providers: [RecordService]
})
export class TableModule { }
