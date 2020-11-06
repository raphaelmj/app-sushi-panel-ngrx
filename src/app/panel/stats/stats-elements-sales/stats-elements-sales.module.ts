import { WindowService } from './../../../services/window.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../../shared/material.module';
import { ToolsModule } from './../../../tools/tools.module';
import { PipesModule } from './../../../pipes/pipes.module';
import { StatsToolsModule } from './../stats-tools/stats-tools.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsElementsSalesRoutingModule } from './stats-elements-sales-routing.module';
import { StatsElementsSalesComponent } from './stats-elements-sales.component';
import { SalesElementsDartComponent } from './sales-elements-dart/sales-elements-dart.component';


@NgModule({
  declarations: [StatsElementsSalesComponent, SalesElementsDartComponent],
  imports: [
    CommonModule,
    StatsElementsSalesRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    ToolsModule,
    PipesModule,
    StatsToolsModule,
    NgxChartsModule
  ],
  providers: [
    WindowService
  ]
})
export class StatsElementsSalesModule { }
