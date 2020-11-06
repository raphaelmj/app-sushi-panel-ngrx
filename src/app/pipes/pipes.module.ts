import { ConfigStepByElementViewGroupPipe } from './config-step-by-element-view-group.pipe';
import { ExtraPriceSimplePipe } from './extra-price-simple.pipe';
import { GroupOptionsTypesQuantityPipe } from './group-options-types-quantity.pipe';
import { ConfigStepsViewGroupPipe } from './config-steps-view-group.pipe';
import { ConfigStepElementNamePipe } from './config-step-element-name.pipe';
import { MergeNamesArrayPipe } from './merge-names-array.pipe';
import { ConfigStepPricePipe } from './config-step-price.pipe';
import { ConfigStepNamePipe } from './config-step-name.pipe';
import { DaySuffixPipe } from './day-suffix.pipe';
import { PricePerQuantityPipe } from './price-per-quantity.pipe';
import { ExtraPriceInfoPipe } from './extra-price-info.pipe';
import { RoleNamePipe } from './role-name.pipe';
import { StripTagsPipe } from './strip-tags.pipe';
import { DescListGroupPipe } from './desc-list-group.pipe';
import { OrderLimitTimePipe } from './order-limit-time.pipe';
import { OrderStatusPipe } from './order-status.pipe';
import { PlusPriceDetailsPipe } from './plus-price-details.pipe';
import { ActionShortNamePipe } from './action-short-name.pipe';
import { ActionNamePipe } from './action-name.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTypeNamePipe } from './menu-type-name.pipe';
import { MenuOptionTypeNamePipe } from './menu-option-type-name.pipe';



@NgModule({
  declarations: [
    MenuTypeNamePipe,
    MenuOptionTypeNamePipe,
    ActionNamePipe,
    ActionShortNamePipe,
    PlusPriceDetailsPipe,
    OrderStatusPipe,
    OrderLimitTimePipe,
    DescListGroupPipe,
    StripTagsPipe,
    RoleNamePipe,
    ExtraPriceInfoPipe,
    PricePerQuantityPipe,
    DaySuffixPipe,
    ConfigStepNamePipe,
    ConfigStepPricePipe,
    MergeNamesArrayPipe,
    ConfigStepElementNamePipe,
    ConfigStepsViewGroupPipe,
    GroupOptionsTypesQuantityPipe,
    ExtraPriceSimplePipe,
    ConfigStepByElementViewGroupPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MenuTypeNamePipe,
    MenuOptionTypeNamePipe,
    ActionNamePipe,
    ActionShortNamePipe,
    PlusPriceDetailsPipe,
    OrderStatusPipe,
    OrderLimitTimePipe,
    DescListGroupPipe,
    StripTagsPipe,
    RoleNamePipe,
    ExtraPriceInfoPipe,
    PricePerQuantityPipe,
    DaySuffixPipe,
    ConfigStepNamePipe,
    ConfigStepPricePipe,
    MergeNamesArrayPipe,
    ConfigStepElementNamePipe,
    ConfigStepsViewGroupPipe,
    GroupOptionsTypesQuantityPipe,
    ExtraPriceSimplePipe,
    ConfigStepByElementViewGroupPipe
  ]
})
export class PipesModule { }
