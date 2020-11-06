import { UserTokenResolveService } from './../services/auth/user-token-resolve.service';
import { ProtectBySuperGuard } from './../guards/protect-by-super.guard';
import { RedirectIfNotauthGuard } from './../guards/redirect-if-notauth.guard';
import { PanelComponent } from './panel.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    resolve: {},
    canActivate: [RedirectIfNotauthGuard],
  },
  {
    path: 'list-menu',
    loadChildren: () =>
      import('./list-menu/list-menu.module').then((m) => m.ListMenuModule),
    canActivate: [RedirectIfNotauthGuard],
  },
  {
    path: 'menu-elements',
    loadChildren: () =>
      import('./menu-elements/menu-elements.module').then((m) => m.MenuElementsModule),
    canActivate: [RedirectIfNotauthGuard],
  },
  {
    path: 'options-and-config',
    loadChildren: () =>
      import('./options-and-config/options-and-config.module').then(m => m.OptionsAndConfigModule),
    canActivate: [RedirectIfNotauthGuard],
  },
  {
    path: 'orders-board',
    loadChildren: () =>
      import('./orders-board/orders-board.module').then(m => m.OrdersBoardModule),
    canActivate: [RedirectIfNotauthGuard],
  },
  {
    path: 'order-menu',
    loadChildren: () =>
      import('./order-menu/order-menu.module').then(m => m.OrderMenuModule),
    canActivate: [RedirectIfNotauthGuard],
  },
  {
    path: 'stats',
    loadChildren: () =>
      import('./stats/stats.module').then(m => m.StatsModule),
    canActivate: [RedirectIfNotauthGuard, ProtectBySuperGuard],
    canLoad: [ProtectBySuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelRoutingModule { }
