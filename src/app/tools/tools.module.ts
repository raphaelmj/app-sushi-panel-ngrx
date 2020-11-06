import { RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { PaginationComponent } from './pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../shared/material.module';
import { ConfirmWindowComponent } from './confirm-window/confirm-window.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCollectionChangeComponent } from './order-collection-change/order-collection-change.component';
import { ConfirmByInputDataComponent } from './confirm-by-input-data/confirm-by-input-data.component';
import { SelectOptionComponent } from './material-dialog/select-option/select-option.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SelectDateComponent } from './select-date/select-date.component';
import { SelectDatetimeComponent } from './select-datetime/select-datetime.component';
import { SelectTimeComponent } from './select-time/select-time.component';


@NgModule({
  declarations: [
    ConfirmWindowComponent,
    OrderCollectionChangeComponent,
    ConfirmByInputDataComponent,
    PaginationComponent,
    SelectOptionComponent,
    SelectDateComponent,
    SelectDatetimeComponent,
    SelectTimeComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    ConfirmWindowComponent,
    OrderCollectionChangeComponent,
    ConfirmByInputDataComponent,
    PaginationComponent,
    SelectOptionComponent,
    SelectDateComponent,
    SelectDatetimeComponent,
    SelectTimeComponent,
    NavComponent
  ]
})
export class ToolsModule { }
