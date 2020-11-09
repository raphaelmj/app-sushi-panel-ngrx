import { element } from 'protractor';
import { map, tap, mergeMap, concatMap, finalize, first } from 'rxjs/operators';
import { MenuCategoryEntityService } from './../services/menu-category-entity.service';
import { Observable, Subscription, of } from 'rxjs';
import { MenuCategoryRefreshService } from './../../../services/menu/menu-category-refresh.service';
import { MenuCategoryService } from './../../../services/menu/menu-category.service';
import { MenuCategory } from './../../../models/menu-category';
import { Component, OnInit, Output, EventEmitter, Input, Inject, OnDestroy } from '@angular/core';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-change-order-menu-categories',
  templateUrl: './change-order-menu-categories.component.html',
  styleUrls: ['./change-order-menu-categories.component.scss']
})
export class ChangeOrderMenuCategoriesComponent implements OnInit, OnDestroy {

  @Input() menuCategories: MenuCategory[]
  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  sortable: Sortable

  subMenuCategory: Subscription

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private menuCategoryEntityService: MenuCategoryEntityService,
    private menuCategoryService: MenuCategoryService,
    private menuCategoryRefreshService: MenuCategoryRefreshService
  ) { }

  ngOnInit(): void {

    this.createSortable()


  }

  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortP'), {

      onEnd: function (evt) {

        var element = this.menuCategories[evt.oldIndex];
        this.menuCategories.splice(evt.oldIndex, 1);
        this.menuCategories.splice(evt.newIndex, 0, element);
        this.changeOrder()
      }.bind(this)

    })
  }

  changeOrder() {
    of(this.menuCategories)
      .pipe(
        map(mc => {
          var nmc: MenuCategory[] = mc.map(m => {
            var { elements, ...rest } = m
            return rest
          })
          return nmc
        }),
        mergeMap(mc => {
          return this.menuCategoryService.changeOrder(mc)
        }),
        tap(mc => {
          // var nmc: Partial<MenuCategory>[] = mc.map(m => m)
          this.menuCategoryEntityService.removeManyFromCache(mc)
          this.menuCategoryEntityService.addManyToCache(mc)
          // this.menuCategoryEntityService.upsertManyInCache(mc)
        })
      ).subscribe()

  }

  closeEdit() {
    this.emitClose.emit()
  }

  ngOnDestroy(): void {
    if (this.subMenuCategory) this.subMenuCategory.unsubscribe()
  }


}
