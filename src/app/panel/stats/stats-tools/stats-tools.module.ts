import { RouterModule } from '@angular/router';
import { MaterialModule } from './../../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFiltersComponent } from './date-filters/date-filters.component';
import { CartCategoryFilterComponent } from './cart-category-filter/cart-category-filter.component';
import { StatsMenuComponent } from './stats-menu/stats-menu.component';


@NgModule({
  declarations: [DateFiltersComponent, CartCategoryFilterComponent, StatsMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    DateFiltersComponent,
    CartCategoryFilterComponent,
    StatsMenuComponent
  ]
})
export class StatsToolsModule { }
