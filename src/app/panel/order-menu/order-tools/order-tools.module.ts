import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneNameBtComponent } from './menu-list-btns/one-name-bt/one-name-bt.component';
import { ManyNamesBtComponent } from './menu-list-btns/many-names-bt/many-names-bt.component';
import { DescElementsBtComponent } from './menu-list-btns/desc-elements-bt/desc-elements-bt.component';
import { ConfigPriceBtComponent } from './menu-list-btns/config-price-bt/config-price-bt.component';
import { ConfigStepsBtComponent } from './menu-list-btns/config-steps-bt/config-steps-bt.component';
import { ConfigStepsManyBtComponent } from './menu-list-btns/config-steps-many-bt/config-steps-many-bt.component';



@NgModule({
  declarations: [
    OneNameBtComponent,
    ManyNamesBtComponent,
    DescElementsBtComponent,
    ConfigPriceBtComponent,
    ConfigStepsBtComponent,
    ConfigStepsManyBtComponent
  ],
  imports: [
    CommonModule,
    PipesModule
  ],
  exports: [
    OneNameBtComponent,
    ManyNamesBtComponent,
    DescElementsBtComponent,
    ConfigPriceBtComponent,
    ConfigStepsBtComponent,
    ConfigStepsManyBtComponent
  ]
})
export class OrderToolsModule { }
