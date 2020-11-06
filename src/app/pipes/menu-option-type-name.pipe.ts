import { ElementOptionType } from './../models/site';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'menuOptionTypeName'
})
export class MenuOptionTypeNamePipe implements PipeTransform {

  nameList: Map<string, string> = new Map([
    [ElementOptionType.none, 'Wybór ilości'],
    [ElementOptionType.select, 'Wybór ilości i opcja(e) szczegółowa(e)'],
    [ElementOptionType.custom, 'Wybór opcji oraz opisów'],
    [ElementOptionType.all, 'Wybór opcji, opisów i rozszerzeń']
  ])

  transform(value: ElementOptionType, ...args: unknown[]): unknown {
    return this.nameList.get(value)
  }

}
