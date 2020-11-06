import { element } from 'protractor';
import { MenuElementDataService } from './../services/menu-element-data.service';
import { filter, map, tap, concatMap, mergeMap, mergeAll } from 'rxjs/operators';
import { MenuElementEntityService } from './../services/menu-element-entity.service';
import { MenuCategoryEntityService } from './services/menu-category-entity.service';
import { ConfirmWindowComponent } from './../../tools/confirm-window/confirm-window.component';
import { AddFreeElementComponent } from './add-free-element/add-free-element.component';
import { MenuElementService } from './../../services/menu/menu-element.service';
import { ChangeOrderMenuCategoriesComponent } from './change-order-menu-categories/change-order-menu-categories.component';
import { MenuCategoryRefreshService } from './../../services/menu/menu-category-refresh.service';
import { MenuCategoryService } from './../../services/menu/menu-category.service';
import { AddEditMenuCategoryComponent } from './add-edit-menu-category/add-edit-menu-category.component';
import { MenuElement } from './../../models/menu-element';
import { MenuCategory } from './../../models/menu-category';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription, Observable, of, forkJoin, merge, from } from 'rxjs';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss']
})
export class ListMenuComponent implements OnInit, OnDestroy {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<AddEditMenuCategoryComponent>
  changeOrderC: ComponentRef<ChangeOrderMenuCategoriesComponent>
  freeElementsC: ComponentRef<AddFreeElementComponent>
  confirmC: ComponentRef<ConfirmWindowComponent>
  subRefresh: Subscription
  subCategories: Subscription
  subMenuCategories: Subscription
  subFree: Subscription

  menuCategories: MenuCategory[]
  menuCategories$: Observable<MenuCategory[]>
  freeElements$: Observable<MenuElement[]>

  constructor(
    private activatedRoute: ActivatedRoute,
    private cf: ComponentFactoryResolver,
    private menuCategoryEntityService: MenuCategoryEntityService,
    private menuElementEntityService: MenuElementEntityService,
    private menuCategoryService: MenuCategoryService,
    private menuElementService: MenuElementService,
    private menuCategoryRefreshService: MenuCategoryRefreshService

  ) {
  }

  ngOnInit(): void {
    this.subMenuCategories = this.menuCategoryEntityService.entities$
      .subscribe(m => {
        this.menuCategories = m.map(mel => {
          var { elements, ...rest } = mel
          var nmel: MenuCategory = Object.assign({}, rest)
          nmel.elements = elements.map(el => Object.assign({}, el))
          return nmel
        })
      })

    this.freeElements$ = this.menuElementEntityService.entities$
      .pipe(
        map(elms => elms.filter(el => !el.menuCategoryId))
      )
  }


  drop(event: CdkDragDrop<MenuCategory>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data['elements'], event.previousIndex, event.currentIndex);
      of(event.container.data['elements'])
        .pipe(
          map((elms: MenuElement[]) => {
            elms = elms.map((el, i) => {
              el.ordering = i + 1
              return el
            })
            return elms
          }),
          mergeMap(elms => this.menuElementService.updateMany(elms)),
          tap(elms => {
            this.menuElementEntityService.upsertManyInCache(elms)
          }),
          mergeMap(elms => of(event.container.data)),
          tap(me => {
            var menu: MenuCategory = Object.assign({}, me)
            menu.elements = event.container.data['elements']
            this.menuCategoryEntityService.upsertOneInCache(menu)
          })
        ).subscribe()
    } else {
      transferArrayItem(event.previousContainer.data['elements'],
        event.container.data['elements'],
        event.previousIndex,
        event.currentIndex);

      this.menuElementService.changeElementsOrderAdd(event.container.data['elements'], event.container.data['id'])
        .pipe(
          tap(elms => {
            this.menuElementEntityService.upsertManyInCache(elms)
          }),
          tap(elms => {
            this.menuCategoryEntityService.updateOneInCache(event.container.data)
          }),
          tap(elms => {
            this.menuCategoryEntityService.updateOneInCache(event.previousContainer.data)
          })
        ).subscribe()
    }
  }

  picDown(item: MenuElement, menuCategory: MenuCategory) {
    this.subFree = this.menuElementService.freeElementFromMenuCategory(item)
      .pipe(
        map(me => {
          var mep: Partial<MenuElement> = me
          return mep
        }),
        tap(mep => this.menuElementEntityService.upsertOneInCache(mep)),
        map(mel => menuCategory.elements.filter(el => el.id != mel.id)),
        map(elements => {
          menuCategory.elements = elements
          return menuCategory
        })
      ).subscribe(
        menuCategory => {
          this.menuCategoryEntityService.upsertOneInCache(<Partial<MenuCategory>>menuCategory)
        }
      )
  }

  addGroup() {
    this.editTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<AddEditMenuCategoryComponent>>AddEditMenuCategoryComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.element = this.menuCategoryService.createEmpty()
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }

  editGroup(mc: MenuCategory) {
    this.editTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<AddEditMenuCategoryComponent>>AddEditMenuCategoryComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.element = mc
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }

  changeOrder() {
    this.editTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<ChangeOrderMenuCategoriesComponent>>ChangeOrderMenuCategoriesComponent)
    this.changeOrderC = this.editTemp.createComponent(edit)
    this.changeOrderC.instance.menuCategories$ = this.menuCategoryEntityService.entities$
    this.changeOrderC.instance.emitClose.subscribe(r => {
      this.changeOrderC.destroy()
    })
  }

  addFreeElement(mc: MenuCategory) {
    this.editTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<AddFreeElementComponent>>AddFreeElementComponent)
    this.freeElementsC = this.editTemp.createComponent(edit)
    this.freeElementsC.instance.menuElements$ = this.freeElements$
    this.freeElementsC.instance.menuCategory = mc
    this.freeElementsC.instance.emitClose.subscribe(r => {
      this.freeElementsC.destroy()
    })
  }

  removeMenuCategory(mc: MenuCategory) {
    this.editTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.editTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = mc
    this.confirmC.instance.message = 'Czy checesz usunąć element?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {

      if (r.do) {
        this.confirmC.destroy()
        this.removeMC(r.bundleData)
      } else {
        this.confirmC.destroy()
      }
    })
  }

  removeMC(mc: MenuCategory) {
    this.menuCategoryService.delete(mc.id).then(r => {
      this.menuCategoryRefreshService.refresh()
    })
  }

  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()
    if (this.subCategories)
      this.subCategories.unsubscribe()
    if (this.subFree)
      this.subFree.unsubscribe()
    if (this.subMenuCategories)
      this.subMenuCategories.unsubscribe()
  }


}
