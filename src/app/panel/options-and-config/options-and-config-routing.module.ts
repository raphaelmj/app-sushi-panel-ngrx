import { CurrentAuthResolveService } from './../../services/auth/current-auth-resolve.service';
import { DescOptionsResolveService } from './../../services/options-config/desc-options-resolve.service';
import { ReverseOptionsResolveService } from './../../services/options-config/reverse-options-resolve.service';
import { ConfigResolveService } from './../../services/options-config/config-resolve.service';
import { OptionsAndConfigComponent } from './options-and-config.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: OptionsAndConfigComponent,
    resolve: {
      // currentUser: CurrentAuthResolveService,
      appConfig: ConfigResolveService,
      reverseOptions: ReverseOptionsResolveService,
      descOptions: DescOptionsResolveService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionsAndConfigRoutingModule { }
