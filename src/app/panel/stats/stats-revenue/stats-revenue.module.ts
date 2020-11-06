import { WindowService } from './../../../services/window.service';
import { StatsToolsModule } from './../stats-tools/stats-tools.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../../shared/material.module';
import { ToolsModule } from './../../../tools/tools.module';
import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StatsRevenueRoutingModule } from './stats-revenue-routing.module';
import { StatsRevenueComponent } from './stats-revenue.component';
import { RevenueDartComponent } from './revenue-dart/revenue-dart.component';


@NgModule({
  declarations: [StatsRevenueComponent, RevenueDartComponent],
  imports: [
    CommonModule,
    StatsRevenueRoutingModule,
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
export class StatsRevenueModule { }
