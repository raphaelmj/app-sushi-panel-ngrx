import { MenuElementsRefreshService } from './../../../services/menu-elements-refresh.service';
import { CartCategoryService } from './../../../services/cart/cart-category.service';
import { Color, ColorAdapter } from '@angular-material-components/color-picker';
import { ThemePalette } from '@angular/material/core';
import { CartCategory } from './../../../models/cart-category';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-add-cart-category',
  templateUrl: './edit-add-cart-category.component.html',
  styleUrls: ['./edit-add-cart-category.component.scss']
})
export class EditAddCartCategoryComponent implements OnInit {

  public color: ThemePalette = 'primary';
  public touchUi = false;

  @Input() cartCategory: CartCategory
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  formData: FormGroup

  constructor(
    private fb: FormBuilder,
    private colorAdapter: ColorAdapter,
    private cartCategoryService: CartCategoryService,
    private menuElementsRefreshService: MenuElementsRefreshService
  ) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    var btc: Color = (this.cartCategory.bgColor) ? this.colorAdapter.parse(this.cartCategory.bgColor) : this.colorAdapter.parse('#FFFFFF')
    this.formData = this.fb.group({
      name: [this.cartCategory.name, Validators.required],
      toPlus: [this.cartCategory.toPlus],
      bgColor: [btc]
    })
  }


  closeEdit() {
    this.emitClose.emit()
  }


  saveData() {

    let cc: CartCategory = { ...this.cartCategory, ...this.formData.value }
    var { elements, ...rest } = cc
    rest.bgColor = this.formData.value.bgColor.hex
    if (this.isNew) {

    } else {
      console.log(rest)
      this.cartCategoryService.updateCartCategory(rest).then(r => {
        this.menuElementsRefreshService.refresh()
      })
    }
  }

}
