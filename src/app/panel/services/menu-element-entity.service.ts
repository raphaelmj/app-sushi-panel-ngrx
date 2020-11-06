import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { MenuElement } from './../../models/menu-element';
import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase } from '@ngrx/data';

@Injectable()
export class MenuElementEntityService extends EntityCollectionServiceBase<MenuElement> {

  constructor(
    private serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('MenuElement', serviceElementsFactory)
  }


}
