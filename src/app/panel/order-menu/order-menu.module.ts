import { WindowService } from './../../services/window.service';
import { OrderToolsModule } from './order-tools/order-tools.module';
import { PipesModule } from './../../pipes/pipes.module';
import { ToolsModule } from './../../tools/tools.module';
import { MaterialModule } from './../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderMenuRoutingModule } from './order-menu-routing.module';
import { OrderMenuComponent } from './order-menu.component';


@NgModule({
  declarations: [OrderMenuComponent],
  imports: [
    CommonModule,
    OrderMenuRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    ToolsModule,
    PipesModule,
    OrderToolsModule
  ],
  providers: [
    WindowService
  ]
})
export class OrderMenuModule { }
