import { ConfigResolveService } from './../../services/options-config/config-resolve.service';
import { UserTokenResolveService } from './../../services/auth/user-token-resolve.service';
import { ResolvePlusElementsGroupService } from './../../services/resolve-plus-elements-group.service';
import { CartCategoriesResolveService } from './../../services/cart/cart-categories-resolve.service';
import { MenuCategoriesAllResolveService } from './../../services/menu/menu-categories-all-resolve.service';
import { OptionsResolveService } from './../../services/options/options-resolve.service';
import { OrderMenuComponent } from './order-menu.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    outlet: 'blackContent',
    component: OrderMenuComponent,
    resolve: {
      config: ConfigResolveService,
      user: UserTokenResolveService,
      plusCartCategories: ResolvePlusElementsGroupService,
      options: OptionsResolveService,
      menuElements: MenuCategoriesAllResolveService,
      cartCategories: CartCategoriesResolveService,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderMenuRoutingModule { }
