import { tap, first } from 'rxjs/operators';
import { MenuCategoryEntityService } from './../services/menu-category-entity.service';
import { MenuCategoryRefreshService } from './../../../services/menu/menu-category-refresh.service';
import { MenuCategoryService } from './../../../services/menu/menu-category.service';
import { MenuCategory } from './../../../models/menu-category';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Color, ColorAdapter } from '@angular-material-components/color-picker';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-menu-category',
  templateUrl: './add-edit-menu-category.component.html',
  styleUrls: ['./add-edit-menu-category.component.scss']
})
export class AddEditMenuCategoryComponent implements OnInit, OnDestroy {

  public color: ThemePalette = 'primary';
  public touchUi = false;
  isSaving: boolean = false

  @Input() element: MenuCategory
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()

  editForm: FormGroup
  subUpdate: Subscription

  constructor(
    private fb: FormBuilder,
    private menuCategoryEntityService: MenuCategoryEntityService,
    private menuCategoryService: MenuCategoryService,
    private menuCategoryRefreshService: MenuCategoryRefreshService,
    private colorAdapter: ColorAdapter
  ) { }

  ngOnInit(): void {
    // console.log(this.element.bgColor)


    this.createForm()
  }

  createForm() {
    let bgc: Color = (this.element.bgColor) ? this.colorAdapter.parse(this.element.bgColor) : this.colorAdapter.parse('#000000');
    let ftc: Color = (this.element.fontColor) ? this.colorAdapter.parse(this.element.fontColor) : this.colorAdapter.parse('#FFFFFF')
    this.editForm = this.fb.group({
      name: [this.element.name, Validators.required],
      fullName: [this.element.fullName, Validators.required],
      bgColor: [bgc, Validators.required],
      fontColor: [ftc, Validators.required]
    })
  }


  saveData() {


    if (this.editForm.valid) {
      this.isSaving = true;

      let { bgColor, fontColor, ...rs } = this.editForm.value
      let element: MenuCategory = { ...this.element, ...rs }
      element.bgColor = this.editForm.value.bgColor.hex
      element.fontColor = this.editForm.value.fontColor.hex
      let { elements, ...rest } = element

      if (this.isNew) {

        this.subUpdate = this.menuCategoryEntityService.add(element)
          .subscribe(mc => {
            this.emitClose.emit();
            this.isSaving = false
          })

      } else {

        this.subUpdate = this.menuCategoryEntityService.update(rest)
          .subscribe(mc => {
            this.isSaving = false
          })

      }

    }

  }

  closeEdit() {
    this.emitClose.emit()
  }

  ngOnDestroy(): void {
    if (this.subUpdate) this.subUpdate.unsubscribe()
  }


}
