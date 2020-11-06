import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusSetConfigComponent } from './bonus-set-config/bonus-set-config.component';



@NgModule({
  declarations: [BonusSetConfigComponent],
  imports: [
    CommonModule
  ],
  exports: [
    BonusSetConfigComponent
  ]
})
export class OrdersToolsModule { }
