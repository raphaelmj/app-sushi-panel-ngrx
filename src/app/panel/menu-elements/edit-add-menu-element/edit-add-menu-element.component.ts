import { CartCategory } from './../../../models/cart-category';
import { MenuElementsRefreshService } from './../../../services/menu-elements-refresh.service';
import { MenuElementService } from './../../../services/menu/menu-element.service';
import { ElementOptionType, ElementPriceName, ElementDesc, ElementPrice } from './../../../models/site';
import { ElementMenuType, ElementConfigStepsPrice } from './../../../models/menu-element';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MenuElement } from 'src/app/models/menu-element';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-add-menu-element',
  templateUrl: './edit-add-menu-element.component.html',
  styleUrls: ['./edit-add-menu-element.component.scss']
})
export class EditAddMenuElementComponent implements OnInit, OnDestroy {

  @Input() element: MenuElement
  @Input() cartCategory: CartCategory
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  formData: FormGroup
  isSaving: boolean = false
  elementTypes: Array<ElementMenuType> = [
    ElementMenuType.oneName,
    ElementMenuType.manyNames,
    ElementMenuType.configPrice,
    ElementMenuType.descElements,
    ElementMenuType.configStepsPrice,
    ElementMenuType.configStepsPriceMany
  ]

  optionsOnInits: Array<ElementOptionType> = [
    ElementOptionType.none,
    ElementOptionType.select,
    ElementOptionType.custom,
    ElementOptionType.all
  ]

  boolClassesList: Map<string, boolean> = new Map([
    [ElementMenuType.oneName, false],
    [ElementMenuType.manyNames, false],
    [ElementMenuType.configPrice, false],
    [ElementMenuType.descElements, false],
    [ElementMenuType.configStepsPrice, false],
    [ElementMenuType.configStepsPriceMany, false]
  ])

  disabledGrill: boolean = false
  disabledGluten: boolean = false

  subTypeChange: Subscription
  subOnlyGrill: Subscription
  subOnlyGluten: Subscription

  constructor(
    private fb: FormBuilder,
    private menuElementService: MenuElementService,
    private menuElementsRefreshService: MenuElementsRefreshService) { }


  ngOnInit(): void {
    this.createForm()
    this.subTypeChange = this.formData.get('elementType').valueChanges.subscribe(v => {
      this.setClassesOnTypeChange(v)
    })
    this.setClassesOnTypeChange(this.element.elementType)
    this.subscribeToOnly()
  }


  subscribeToOnly() {
    this.subOnlyGluten = this.formData.get('onlyGluten').valueChanges.subscribe(v => {
      if (v)
        this.formData.get('hasGluten').setValue(true)
      this.disabledGluten = (v) ? true : false
    })
    this.subOnlyGrill = this.formData.get('onlyGrill').valueChanges.subscribe(v => {
      if (v)
        this.formData.get('canGrill').setValue(true)
      this.disabledGrill = (v) ? true : false
    })
  }

  createForm() {
    this.formData = this.fb.group({
      optionsOnInit: [this.element.optionsOnInit],
      elastic: [this.element.elastic],
      elementType: [this.element.elementType],
      name: [this.element.name],
      shortName: [this.element.shortName],
      hasNamePrefix: [this.element.hasNamePrefix],
      description: [this.element.description],
      perSizeForAll: [this.element.perSizeForAll],
      hasGluten: [this.element.hasGluten],
      canGrill: [this.element.canGrill],
      canExtra: [this.element.canExtra],
      canPack: [this.element.canPack],
      canOnePlate: [this.element.canOnePlate],
      canAcc: [this.element.canAcc],
      skipStepOne: [this.element.skipStepOne],
      onlyGluten: [this.element.onlyGluten],
      onlyGrill: [this.element.onlyGrill],
      options: this.createFormArray(this.element.options)
    })
  }

  createFormArray(list: string[]): FormArray {
    var array: FormArray = this.fb.array([])
    list.map(s => {
      array.push(new FormControl(s))
    })
    return array
  }

  setClassesOnTypeChange(type: ElementMenuType) {
    this.boolClassesList.forEach((el, key: ElementMenuType) => {
      if (type == key) {
        this.boolClassesList.set(key, true)
      } else {
        this.boolClassesList.set(key, false)
      }
    })
  }

  addOption() {
    (this.formData.get('options') as FormArray).push(new FormControl(''))
  }

  removeOption(i: number) {
    this.formData.get('options')['value'].splice(i, 1)
    this.formData.get('options')['controls'].splice(i, 1)
  }

  changePriceNames(event: ElementPriceName[]) {
    this.element.priceNames = event
  }

  changeDesc(event: ElementDesc[]) {
    this.element.descElements = event
  }

  changePrice(event: ElementPrice[]) {
    this.element.price = event
  }

  changeConfig(event: ElementConfigStepsPrice[]) {
    this.element.configStepsPrice = event
  }

  closeEdit() {
    this.emitClose.emit()
  }


  saveData() {
    var element: MenuElement = { ...this.element, ...this.formData.value }
    var { cartCategory, ...rest } = element
    if (this.isNew) {
      this.menuElementService.create(rest, this.cartCategory).then(r => {
        this.menuElementsRefreshService.refresh()
        this.emitClose.emit()
      })
    } else {
      this.menuElementService.update(rest).then(r => {
        this.menuElementsRefreshService.refresh()
      })
    }
  }

  ngOnDestroy(): void {
    if (this.subTypeChange)
      this.subTypeChange.unsubscribe()
    if (this.subOnlyGluten)
      this.subOnlyGluten.unsubscribe()
    if (this.subOnlyGrill)
      this.subOnlyGrill.unsubscribe()
  }

}
