import { OrdersToolsModule } from './../../orders-tools/orders-tools.module';
import { PipesModule } from './../../pipes/pipes.module';
import { MaterialModule } from './../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToolsModule } from './../../tools/tools.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersBoardRoutingModule } from './orders-board-routing.module';
import { OrdersBoardComponent } from './orders-board.component';
import { OrdersFiltersComponent } from './orders-filters/orders-filters.component';
import { OrderBoardSquareComponent } from './order-board-square/order-board-square.component';
import { OrderSquareElementComponent } from './order-board-square/order-square-element/order-square-element.component';


@NgModule({
  declarations: [OrdersBoardComponent, OrdersFiltersComponent, OrderBoardSquareComponent, OrderSquareElementComponent],
  imports: [
    CommonModule,
    OrdersBoardRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    ToolsModule,
    PipesModule,
    OrdersToolsModule
  ]
})
export class OrdersBoardModule { }
