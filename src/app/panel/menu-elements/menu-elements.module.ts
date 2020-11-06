import { PipesModule } from './../../pipes/pipes.module';
import { NgxMatColorPickerModule, MAT_COLOR_FORMATS, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { ToolsModule } from './../../tools/tools.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MaterialModule } from './../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuElementsRoutingModule } from './menu-elements-routing.module';
import { MenuElementsComponent } from './menu-elements.component';
import { EditAddMenuElementComponent } from './edit-add-menu-element/edit-add-menu-element.component';
import { PriceNamesComponent } from './edit-add-menu-element/price-names/price-names.component';
import { DescElementsComponent } from './edit-add-menu-element/desc-elements/desc-elements.component';
import { PricesComponent } from './edit-add-menu-element/prices/prices.component';
import { ConfigStepsComponent } from './edit-add-menu-element/config-steps/config-steps.component';
import { EditAddCartCategoryComponent } from './edit-add-cart-category/edit-add-cart-category.component';


@NgModule({
  declarations: [MenuElementsComponent, EditAddMenuElementComponent, PriceNamesComponent, DescElementsComponent, PricesComponent, ConfigStepsComponent, EditAddCartCategoryComponent],
  imports: [
    CommonModule,
    MenuElementsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    DragDropModule,
    ToolsModule,
    NgxMatColorPickerModule,
    PipesModule,
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
})
export class MenuElementsModule { }
