import { appConfigReducer } from './app-config-entity/app-config.reducers';
import { ToolsModule } from './../../tools/tools.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../shared/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptionsAndConfigRoutingModule } from './options-and-config-routing.module';
import { OptionsAndConfigComponent } from './options-and-config.component';
import { EditDescComponent } from './edit-desc/edit-desc.component';
import { EditReverseComponent } from './edit-reverse/edit-reverse.component';
import { DescDataFormComponent } from './edit-desc/desc-data-form/desc-data-form.component';
import { ReverseDataFormComponent } from './edit-reverse/reverse-data-form/reverse-data-form.component';
import { ChangeStringsOrderComponent } from './change-strings-order/change-strings-order.component';
import { ChangeOptionsGroupOrderComponent } from './change-options-group-order/change-options-group-order.component';
import { AddOptionElementComponent } from './add-option-element/add-option-element.component';
import { AppConfigEditComponent } from './app-config-edit/app-config-edit.component';
import { UsersAdminComponent } from './users-admin/users-admin.component';
import { UserOneEditComponent } from './users-admin/user-one-edit/user-one-edit.component';
import { StatusStatesSelectComponent } from './app-config-edit/status-states-select/status-states-select.component';
import { StoreModule } from '@ngrx/store';
import * as fromConfigOfApp from './app-config-entity/app-config.reducers';
import { EffectsModule } from '@ngrx/effects';
import { AppConfigEffectsEffects } from './effects/app-config-effects.effects';
import * as fromReverseOptions from './reverse-options-entity/reverse-options.reducer';
import { ReverseOptionsEffectsEffects } from './effects/reverse-options-effects.effects';
import * as fromDescOptions from './desc-options-entity/desc-options.reducer';
import { DescOptionsEffectsEffects } from './effects/desc-options-effects.effects';


@NgModule({
  declarations: [OptionsAndConfigComponent, EditDescComponent, EditReverseComponent, DescDataFormComponent, ReverseDataFormComponent, ChangeStringsOrderComponent, ChangeOptionsGroupOrderComponent, AddOptionElementComponent, AppConfigEditComponent, UsersAdminComponent, UserOneEditComponent, StatusStatesSelectComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    OptionsAndConfigRoutingModule,
    ToolsModule,
    StoreModule.forFeature(fromConfigOfApp.configOfAppFeatureKey, appConfigReducer, { metaReducers: fromConfigOfApp.metaReducers }),
    StoreModule.forFeature(fromReverseOptions.reverseOptionsesFeatureKey, fromReverseOptions.reducer),
    EffectsModule.forFeature([AppConfigEffectsEffects, ReverseOptionsEffectsEffects, DescOptionsEffectsEffects]),
    StoreModule.forFeature(fromDescOptions.descOptionsesFeatureKey, fromDescOptions.reducer),
  ]
})
export class OptionsAndConfigModule { }
