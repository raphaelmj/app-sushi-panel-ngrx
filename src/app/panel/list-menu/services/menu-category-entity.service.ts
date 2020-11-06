import { MenuCategoryService } from './../../../services/menu/menu-category.service';
import { MenuCategory } from './../../../models/menu-category';
import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data"

@Injectable()
export class MenuCategoryEntityService extends EntityCollectionServiceBase<MenuCategory> {

  constructor(
    private serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('MenuCategory', serviceElementsFactory)
  }


}
