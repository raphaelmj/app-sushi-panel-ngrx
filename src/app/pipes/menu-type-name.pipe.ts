import { ElementMenuType } from './../models/menu-element';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'menuTypeName'
})
export class MenuTypeNamePipe implements PipeTransform {

  nameList: Map<string, string> = new Map([
    [ElementMenuType.oneName, 'Pojedyncza nazwa'],
    [ElementMenuType.manyNames, 'Wiele nazwa'],
    [ElementMenuType.configPrice, 'Konfigurowana cena'],
    [ElementMenuType.descElements, 'Grupa elementów'],
    [ElementMenuType.configStepsPrice, 'Element z wieloma opcjami'],
    [ElementMenuType.configStepsPriceMany, 'Wiele elementów z wieloma opcjami']
  ])

  transform(name: ElementMenuType, ...args: unknown[]): string {
    return this.nameList.get(name)
  }

}
