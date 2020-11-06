import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { LoginComponent } from './login.component';
import { RedirectIfAuthGuard } from '../guards/redirect-if-auth.guard';

const LOGIN_ROUTES: Route[] = [
  {
    path: 'login',
    component: <any>LoginComponent,
    canActivate: [RedirectIfAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(LOGIN_ROUTES)],
  exports: [RouterModule],
  providers: [],
})
export class LoginRoutingModule {}
