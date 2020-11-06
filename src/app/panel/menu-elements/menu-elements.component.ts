import { ConfirmWindowComponent } from './../../tools/confirm-window/confirm-window.component';
import { MenuElementService } from './../../services/menu/menu-element.service';
import { CartCategoryService } from './../../services/cart/cart-category.service';
import { MenuElementsRefreshService } from './../../services/menu-elements-refresh.service';
import { EditAddMenuElementComponent } from './edit-add-menu-element/edit-add-menu-element.component';
import { CartCategory } from './../../models/cart-category';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef, Type, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MenuElement } from 'src/app/models/menu-element';
import { Subscription } from 'rxjs';
import { EditAddCartCategoryComponent } from './edit-add-cart-category/edit-add-cart-category.component';

@Component({
  selector: 'app-menu-elements',
  templateUrl: './menu-elements.component.html',
  styleUrls: ['./menu-elements.component.scss']
})
export class MenuElementsComponent implements OnInit, OnDestroy {

  @ViewChild('temp', { read: ViewContainerRef, static: true }) temp: ViewContainerRef
  editAddC: ComponentRef<EditAddMenuElementComponent>
  editAddCc: ComponentRef<EditAddCartCategoryComponent>
  carts: CartCategory[]
  confirmC: ComponentRef<ConfirmWindowComponent>

  subClose: Subscription
  subRefresh: Subscription
  subCarts: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    private cf: ComponentFactoryResolver,
    private menuElementsRefreshService: MenuElementsRefreshService,
    private cartCategoryService: CartCategoryService,
    private menuElementService: MenuElementService
  ) {
    this.carts = this.activatedRoute.snapshot.data['carts']
  }


  ngOnInit(): void {
    this.subRefresh = this.menuElementsRefreshService.action$.subscribe(bool => {
      if (bool) {
        this.subCarts = this.cartCategoryService.getAll().subscribe(r => {
          this.carts = r
        })
      }
    })
  }

  drop(event: CdkDragDrop<CartCategory[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data['elements'], event.previousIndex, event.currentIndex);
      // console.log('saveInSide', event.container.data)
    } else {
      transferArrayItem(event.previousContainer.data['elements'],
        event.container.data['elements'],
        event.previousIndex,
        event.currentIndex);
      // console.log(event.container.data['elements'], event.container.data)
      this.cartCategoryService.updateCartElements(event.container.data['elements'], event.container.data['id']).then(r => {
        this.menuElementsRefreshService.refresh()
      })
    }
  }





  openEdit(item: MenuElement) {
    this.temp.clear();
    let edit = this.cf.resolveComponentFactory(<Type<EditAddMenuElementComponent>>EditAddMenuElementComponent);
    this.editAddC = this.temp.createComponent(edit);
    this.editAddC.instance.element = item
    this.editAddC.instance.isNew = false
    this.subClose = this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }

  addElement(cartCategory: CartCategory) {
    var { elements, ...rest } = cartCategory
    this.temp.clear();
    let edit = this.cf.resolveComponentFactory(<Type<EditAddMenuElementComponent>>EditAddMenuElementComponent);
    this.editAddC = this.temp.createComponent(edit);
    this.editAddC.instance.element = this.menuElementService.makeEmpty()
    this.editAddC.instance.cartCategory = rest
    this.editAddC.instance.isNew = true
    this.subClose = this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }

  remove(item: MenuElement) {
    this.temp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.temp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = item
    this.confirmC.instance.message = 'Czy checesz usunąć element?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {

      if (r.do) {
        this.confirmC.destroy()
        this.menuElementService.delete(r.bundleData.id).then(r => {
          this.menuElementsRefreshService.refresh()
        })
      } else {
        this.confirmC.destroy()
      }
    })
  }

  changePlus(list: CartCategory) {
    this.cartCategoryService.changeField(!list.toPlus, 'toPlus', list.id).then(r => {
      this.menuElementsRefreshService.refresh()
    })
  }

  changePlusElement(el: MenuElement) {
    this.menuElementService.changeField(!el.showOnPlus, 'showOnPlus', el.id).then(r => {
      this.menuElementsRefreshService.refresh()
    })
  }

  openEditCartC(cc: CartCategory) {
    this.temp.clear();
    let edit = this.cf.resolveComponentFactory(<Type<EditAddCartCategoryComponent>>EditAddCartCategoryComponent);
    this.editAddCc = this.temp.createComponent(edit);
    this.editAddCc.instance.cartCategory = cc
    this.editAddCc.instance.isNew = false
    this.subClose = this.editAddCc.instance.emitClose.subscribe(r => {
      this.editAddCc.destroy()
    })
  }

  ngOnDestroy(): void {
    if (this.subClose)
      this.subClose.unsubscribe()
    if (this.subRefresh)
      this.subRefresh.unsubscribe()
    if (this.subCarts)
      this.subCarts.unsubscribe()
  }

}
