import { RevenueResolveService } from './../../../services/stats/revenue/revenue-resolve.service';
import { StatsRevenueComponent } from './stats-revenue.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", component: StatsRevenueComponent, outlet: 'blackContent', resolve: { stats: RevenueResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRevenueRoutingModule { }
