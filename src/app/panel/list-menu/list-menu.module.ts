import { UserUuidInterceptor } from './../../interceptors/user-uuid.interceptor';
import { AppTokenInterceptor } from './../../interceptors/app-token.interceptor';
import { MenuElementEntityService } from './../services/menu-element-entity.service';
import { MenuElementsResolveService } from './../services/menu-elements-resolve.service';
import { MenuElementDataService } from './../services/menu-element-data.service';
import { MenuCategoryDataService } from './services/menu-category-data.service';
import { MenuCategoryResolveService } from './../../services/menu/menu-category-resolve.service';
import { MenuCategoryEntityService } from './services/menu-category-entity.service';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { PipesModule } from './../../pipes/pipes.module';
import { ToolsModule } from './../../tools/tools.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../shared/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ListMenuRoutingModule } from './list-menu-routing.module';
import { ListMenuComponent } from './list-menu.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddEditMenuCategoryComponent } from './add-edit-menu-category/add-edit-menu-category.component';
import { ChangeOrderMenuCategoriesComponent } from './change-order-menu-categories/change-order-menu-categories.component';
import { AddFreeElementComponent } from './add-free-element/add-free-element.component';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { compareByOrdering } from 'src/app/models/compare-by-ordering';

const entityMetaData: EntityMetadataMap = {
  MenuCategory: {
    // entityName: 'MenuCategory'
    sortComparer: compareByOrdering,
    entityDispatcherOptions: {
      optimisticUpdate: true
    }
  },
  MenuElement: {
    sortComparer: compareByOrdering,
    entityDispatcherOptions: {
      optimisticUpdate: true
    }
  }
}

@NgModule({
  declarations: [ListMenuComponent, AddEditMenuCategoryComponent, ChangeOrderMenuCategoriesComponent, AddFreeElementComponent],
  imports: [
    CommonModule,
    ListMenuRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    DragDropModule,
    ToolsModule,
    NgxMatColorPickerModule,
    PipesModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AppTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UserUuidInterceptor, multi: true },
    MenuCategoryEntityService,
    MenuCategoryResolveService,
    MenuCategoryDataService,
    MenuElementDataService,
    MenuElementsResolveService,
    MenuElementEntityService,
    MenuElementDataService
  ],
})
export class ListMenuModule {
  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private menuCategoryDataService: MenuCategoryDataService,
    private menuElementDataService: MenuElementDataService
  ) {
    this.eds.registerMetadataMap(entityMetaData)
    entityDataService.registerService('MenuCategory', menuCategoryDataService);
    entityDataService.registerService('MenuElement', menuElementDataService);
  }
}
