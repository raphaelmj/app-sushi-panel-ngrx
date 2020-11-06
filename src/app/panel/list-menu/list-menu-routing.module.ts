import { MenuElementsResolveService } from './../services/menu-elements-resolve.service';
import { MenuCategoryFreeResolveService } from './../../services/menu/menu-category-free-resolve.service';
import { MenuCategoryResolveService } from './../../services/menu/menu-category-resolve.service';
import { ListMenuComponent } from './list-menu.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: ListMenuComponent,
    resolve: { menuCategories: MenuCategoryResolveService, /*freeElements: MenuCategoryFreeResolveService,*/ menuElements: MenuElementsResolveService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListMenuRoutingModule { }
