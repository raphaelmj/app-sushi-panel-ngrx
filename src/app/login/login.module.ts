import { AuthEffects } from './auth.effects';
import { MaterialModule } from '../shared/material.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { LoginRoutingModule } from './login-routing.module';
import { ServicesModule } from '../services/services.module';
// import { RedirectIfAuthGuard } from '../guards/redirect-if-auth.guard';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './reducers';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoginRoutingModule,
    ServicesModule,
    RouterModule,
    ServicesModule,
    StoreModule.forFeature(
      fromAuth.authFeatureKey,
      fromAuth.authReducer
      // { metaReducers: fromAuth.metaReducers }
    ),
    EffectsModule.forFeature([AuthEffects])
  ],
  exports: [],
  declarations: [LoginComponent],
  providers: [],
})
export class LoginModule { }
