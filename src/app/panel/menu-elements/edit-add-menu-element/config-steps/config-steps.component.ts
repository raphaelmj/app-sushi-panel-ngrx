import { filter } from 'rxjs/operators';
import { OrderCollectionChangeComponent, PresentType } from './../../../../tools/order-collection-change/order-collection-change.component';
import { ElementConfigStepsPrice, ElementConfigStepsPriceType, PriceTypeOption } from './../../../../models/menu-element';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, ViewChild, ComponentRef, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';


@Component({
  selector: 'app-config-steps',
  templateUrl: './config-steps.component.html',
  styleUrls: ['./config-steps.component.scss']
})
export class ConfigStepsComponent implements OnInit, OnDestroy {

  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  orderChangeC: ComponentRef<OrderCollectionChangeComponent>
  @Output() changeEmit: EventEmitter<ElementConfigStepsPrice[]> = new EventEmitter<ElementConfigStepsPrice[]>()
  @Input() configStepsPrice: ElementConfigStepsPrice[]
  formData: FormGroup
  subChanges: Subscription
  pauseForm: boolean = false

  constructor(private fb: FormBuilder, private cf: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.createForm()
    this.subChanges = this.formData.valueChanges.pipe(filter(_ => !this.pauseForm)).subscribe(v => {
      this.changeEmit.emit(<ElementConfigStepsPrice[]>v.configStepsPrice)
    });
  }

  createForm() {
    this.formData = this.fb.group({
      configStepsPrice: this.createConfigArray()
    })
  }

  createConfigArray(): FormArray {
    var array = this.fb.array([])
    this.configStepsPrice.map(el => {
      array.push(this.fb.group({
        name: el.name,
        shortName: el.shortName,
        types: this.createConfigTypesArray(el.types)
      }))
    })
    return array
  }

  createConfigTypesArray(types: ElementConfigStepsPriceType[]): FormArray {
    var array = this.fb.array([])
    types.map(t => {
      array.push(this.fb.group({
        type: [t.type],
        options: this.createConfigTypeOptionsArray(t.options)
      }))
    })
    return array
  }

  createConfigTypeOptionsArray(priceOpts: PriceTypeOption[]) {
    var array = this.fb.array([])
    priceOpts.map(p => {
      array.push(this.fb.group({
        name: [p.name],
        shortName: [p.shortName],
        price: [p.price, [Validators.required, Validators.pattern('[0-9]+')]],
        isSea: [p.isSea]
      }))
    })
    return array
  }

  addConfig() {
    (this.formData.get('configStepsPrice') as FormArray).push(
      this.fb.group({
        name: '',
        shortName: '',
        types: this.createConfigTypesArray([{
          type: '',
          options: []
        }])
      })
    )
    this.formData.markAsUntouched()
  }

  removeConfig(i: number) {
    this.formData.get('configStepsPrice')['controls'].splice(i, 1)
    this.formData.get('configStepsPrice')['value'].splice(i, 1)
    this.changeEmit.emit(<ElementConfigStepsPrice[]>this.formData.get('configStepsPrice').value)
  }

  addType(i: number) {
    (this.formData.get('configStepsPrice')['controls'][i].get('types') as FormArray).push(
      this.fb.group({
        type: [''],
        options: this.createConfigTypeOptionsArray([])
      })
    )
    this.formData.markAsUntouched()
  }

  removeType(i: number, j: number) {
    this.formData.get('configStepsPrice')['controls'][i].get('types')['controls'].splice(j, 1)
    this.formData.get('configStepsPrice')['controls'][i].get('types')['value'].splice(j, 1)
    this.changeEmit.emit(<ElementConfigStepsPrice[]>this.formData.get('configStepsPrice').value)
  }

  addOption(i: number, j: number) {
    (this.formData.get('configStepsPrice')['controls'][i].get('types')['controls'][j].get('options') as FormArray).push(
      this.fb.group({
        name: [''],
        shortName: [''],
        price: [0, [Validators.required, Validators.pattern('[0-9]+')]],
        isSea: [false]
      })
    )
    this.formData.markAsUntouched()
  }

  removeOption(i: number, j: number, k: number) {
    this.formData.get('configStepsPrice')['controls'][i].get('types')['controls'][j].get('options')['controls'].splice(k, 1)
    this.formData.get('configStepsPrice')['controls'][i].get('types')['controls'][j].get('options')['value'].splice(k, 1)
    this.changeEmit.emit(<ElementConfigStepsPrice[]>this.formData.get('configStepsPrice').value)
  }

  changeOrder() {
    this.temp.clear()
    let list = this.cf.resolveComponentFactory(<Type<OrderCollectionChangeComponent>>OrderCollectionChangeComponent)
    this.orderChangeC = this.temp.createComponent(list)
    this.orderChangeC.instance.elements = this.configStepsPrice
    this.orderChangeC.instance.presentType = PresentType.oneKey
    this.orderChangeC.instance.nameKey = 'name'
    this.orderChangeC.instance.emitChange.subscribe(r => {
      this.configStepsPrice = r
      this.changeFormOrder()
    })
    this.orderChangeC.instance.emitClose.subscribe(r => {
      this.orderChangeC.destroy()
    })
  }

  changeFormOrder() {
    this.pauseForm = true;
    (this.formData.get('configStepsPrice') as FormArray).clear();
    this.configStepsPrice.map(el => {
      (this.formData.get('configStepsPrice') as FormArray).push(
        this.fb.group({
          name: el.name,
          shortName: el.shortName,
          types: this.createConfigTypesArray(el.types)
        })
      )
    })
    this.pauseForm = false;
    this.formData.markAsUntouched()
    this.changeEmit.emit(<ElementConfigStepsPrice[]>this.formData.get('configStepsPrice').value)
  }


  changeOrderSecond(i: number) {
    this.temp.clear()
    let list = this.cf.resolveComponentFactory(<Type<OrderCollectionChangeComponent>>OrderCollectionChangeComponent)
    this.orderChangeC = this.temp.createComponent(list)
    this.orderChangeC.instance.elements = this.configStepsPrice[i].types
    this.orderChangeC.instance.presentType = PresentType.oneKey
    this.orderChangeC.instance.nameKey = 'type'
    this.orderChangeC.instance.emitChange.subscribe(r => {
      this.configStepsPrice[i].types = r
      // console.log(r)
      this.changeFormOrderSecond(i)
    })
    this.orderChangeC.instance.emitClose.subscribe(r => {
      this.orderChangeC.destroy()
    })
  }

  changeFormOrderSecond(i: number) {
    this.pauseForm = true;
    (this.formData.get('configStepsPrice')['controls'][i].get('types') as FormArray).clear();
    this.configStepsPrice[i].types.map(t => {
      (this.formData.get('configStepsPrice')['controls'][i].get('types') as FormArray).push(
        this.fb.group({
          type: [t.type],
          options: this.createConfigTypeOptionsArray(t.options)
        })
      )
    })
    this.pauseForm = false;
    this.formData.markAsUntouched()
    this.changeEmit.emit(<ElementConfigStepsPrice[]>this.formData.get('configStepsPrice').value)
  }

  changeOrderThird(i: number, j: number) {
    this.temp.clear()
    let list = this.cf.resolveComponentFactory(<Type<OrderCollectionChangeComponent>>OrderCollectionChangeComponent)
    this.orderChangeC = this.temp.createComponent(list)
    this.orderChangeC.instance.elements = this.configStepsPrice[i].types[j].options
    this.orderChangeC.instance.presentType = PresentType.oneKey
    this.orderChangeC.instance.nameKey = 'name'
    this.orderChangeC.instance.emitChange.subscribe(r => {
      this.configStepsPrice[i].types[j].options = r
      // console.log(r)
      this.changeFormOrderThird(i, j)
    })
    this.orderChangeC.instance.emitClose.subscribe(r => {
      this.orderChangeC.destroy()
    })
  }

  changeFormOrderThird(i: number, j: number) {
    this.pauseForm = true;
    (this.formData.get('configStepsPrice')['controls'][i].get('types')['controls'][j].get('options') as FormArray).clear();
    this.configStepsPrice[i].types[j].options.map(p => {
      (this.formData.get('configStepsPrice')['controls'][i].get('types')['controls'][j].get('options') as FormArray).push(
        this.fb.group({
          name: [p.name],
          shortName: [p.shortName],
          price: [p.price, [Validators.required, Validators.pattern('[0-9]+')]],
          isSea: [p.isSea]
        })
      )
    })
    this.pauseForm = false;
    this.formData.markAsUntouched()
    this.changeEmit.emit(<ElementConfigStepsPrice[]>this.formData.get('configStepsPrice').value)
  }

  ngOnDestroy(): void {
    if (this.subChanges)
      this.subChanges.unsubscribe()
  }

}
