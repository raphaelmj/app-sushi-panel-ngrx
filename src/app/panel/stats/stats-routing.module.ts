import { StatsComponent } from './stats.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", component: StatsComponent },
  {
    path: "revenue",
    loadChildren: () => import('./stats-revenue/stats-revenue.module').then(m => m.StatsRevenueModule)
  },
  {
    path: "elements-sales",
    loadChildren: () => import('./stats-elements-sales/stats-elements-sales.module').then(m => m.StatsElementsSalesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule { }
