import { CartCategoriesResolveService } from './../../services/cart/cart-categories-resolve.service';
import { MenuElementsComponent } from './menu-elements.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", component: MenuElementsComponent, resolve: { carts: CartCategoriesResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuElementsRoutingModule { }
