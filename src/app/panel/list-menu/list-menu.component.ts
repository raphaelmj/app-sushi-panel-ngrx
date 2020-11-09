import { element } from 'protractor';
import { MenuElementDataService } from './../services/menu-element-data.service';
import { filter, map, tap, concatMap, mergeMap, mergeAll, combineAll, first, scan, toArray, flatMap, concatAll, finalize, last, takeUntil, reduce } from 'rxjs/operators';
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
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription, Observable, of, forkJoin, merge, zip, Subject, interval, combineLatest, from } from 'rxjs';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
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
        // console.log(m)
        this.menuCategories = m.map(mel => {
          var { elements, ...rest } = mel
          var nmel: MenuCategory = Object.assign({}, rest)
          nmel.elements = elements.map(el => Object.assign({}, el))
          return nmel
        })
      })

    this.freeElements$ = this.menuElementEntityService.entities$
      .pipe(
        map(elms => elms.filter(el => el.menuCategoryId == null))
      )


    // this.subMenuCategories = this.menuCategoryEntityService.entities$
    //   .pipe(
    //     tap(elms => {
    //       this.menuCategories = []
    //     }),
    //     flatMap(mc => {
    //       return mc
    //     }),
    //     mergeMap(r =>
    //       this.menuElementEntityService.entities$
    //         .pipe(
    //           map(els => els.filter(e => e.menuCategoryId == r.id)),
    //           map(els => {
    //             var d = Object.assign({}, r)
    //             d.elements = els
    //             return d
    //           })
    //         )
    //     ),
    //     tap(me => {
    //       console.log('ddd', me.id)
    //     })
    //   ).subscribe(
    //     (value) => {
    //       this.menuCategories.push(value)
    //     }
    //   )


  }


  drop(event: CdkDragDrop<MenuCategory>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data['elements'], event.previousIndex, event.currentIndex);
      of(event.container.data['elements'])
        .pipe(
          map((elms: MenuElement[]) => {
            elms = elms.map((el, i) => {
              var nel = Object.assign({}, el)
              nel.ordering = i + 1
              return nel
            })
            return elms
          }),
          mergeMap(elms => this.menuElementService.updateMany(elms)),
          tap(elms => {
            this.menuElementEntityService.removeManyFromCache(elms)
            this.menuElementEntityService.addManyToCache(elms)
          }),
          mergeMap(elms => of(event.container.data)),
          tap(me => {
            var menu: MenuCategory = Object.assign({}, me)
            menu.elements = event.container.data['elements']
            this.menuCategoryEntityService.removeOneFromCache(menu)
            this.menuCategoryEntityService.addOneToCache(menu)
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
            this.menuElementEntityService.removeManyFromCache(elms)
            this.menuElementEntityService.addManyToCache(elms)
            this.menuCategoryEntityService.removeOneFromCache(event.container.data)
            this.menuCategoryEntityService.addOneToCache(event.container.data)
            this.menuCategoryEntityService.removeOneFromCache(event.previousContainer.data)
            this.menuCategoryEntityService.addOneToCache(event.previousContainer.data)
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
    this.changeOrderC.instance.menuCategories = this.menuCategories
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
    this.menuCategoryEntityService.delete(mc.id)
      .pipe(
        mergeMap(k => of(mc.elements.map(e => { e.menuCategoryId = null; return e })))
      ).subscribe(
        me => {
          this.menuElementEntityService.removeManyFromCache(mc.elements)
          this.menuElementEntityService.addManyToCache(mc.elements)
        }
      )
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
