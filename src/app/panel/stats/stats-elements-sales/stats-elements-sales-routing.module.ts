import { ElementsSalesResolveService } from './../../../services/stats/elements-sales/elements-sales-resolve.service';
import { StatsElementsSalesComponent } from './stats-elements-sales.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartCategoriesResolveService } from 'src/app/services/cart/cart-categories-resolve.service';

const routes: Routes = [
  {
    path: "",
    component: StatsElementsSalesComponent,
    outlet: 'blackContent',
    // runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      stats: ElementsSalesResolveService, cartCategories: CartCategoriesResolveService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsElementsSalesRoutingModule { }
