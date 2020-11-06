import { MenuElement } from './../models/menu-element';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { PanelComponent } from './panel.component';

@NgModule({
  declarations: [PanelComponent],
  imports: [
    CommonModule,
    PanelRoutingModule
  ]
})
export class PanelModule {

}
