import { Update } from '@ngrx/entity';
import { MenuCategoryService } from './../../../services/menu/menu-category.service';
import { CartCategoryService } from './../../../services/cart/cart-category.service';
import { MenuElementEntityService } from './../../services/menu-element-entity.service';
import { MenuCategoryEntityService } from './../services/menu-category-entity.service';
import { concatMap, map, tap, first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MenuCategoryRefreshService } from './../../../services/menu/menu-category-refresh.service';
import { MenuElementService } from './../../../services/menu/menu-element.service';
import { MenuElement } from 'src/app/models/menu-element';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuCategory } from 'src/app/models/menu-category';

@Component({
  selector: 'app-add-free-element',
  templateUrl: './add-free-element.component.html',
  styleUrls: ['./add-free-element.component.scss']
})
export class AddFreeElementComponent implements OnInit {

  @Input() menuElements$: Observable<MenuElement[]>
  @Input() menuCategory: MenuCategory
  @Output() emitClose: EventEmitter<any> = new EventEmitter()

  constructor(
    private menuElementService: MenuElementService,
    private menuCategoryRefreshService: MenuCategoryRefreshService,
    private menuCategoryEntityService: MenuCategoryEntityService,
    private menuElementEntityService: MenuElementEntityService,
    private menuCategoryService: MenuCategoryService
  ) { }

  ngOnInit(): void {
  }

  addElement(item: MenuElement) {

    var { cartCategory, ...menuElement } = item

    of(menuElement)
      .pipe(
        concatMap(me => this.menuElementService.addElementToMenu(me, this.menuCategory.id)),
        tap(me => {
          this.menuElementEntityService.removeOneFromCache(me)
          this.menuElementEntityService.addOneToCache(me)
        }),
        concatMap(me => this.menuCategoryService.getById(this.menuCategory.id)),
        tap(mc => {
          this.menuCategoryEntityService.removeOneFromCache(mc)
          this.menuCategoryEntityService.addOneToCache(mc)
        })
      ).subscribe()

  }

  closeEdit() {
    this.emitClose.emit()
  }

}
