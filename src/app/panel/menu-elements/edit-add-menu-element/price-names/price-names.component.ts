import { filter } from 'rxjs/operators';
import { OrderCollectionChangeComponent, PresentType } from './../../../../tools/order-collection-change/order-collection-change.component';
import { ElementPriceName, ElementPrice } from './../../../../models/site';
import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-price-names',
  templateUrl: './price-names.component.html',
  styleUrls: ['./price-names.component.scss']
})
export class PriceNamesComponent implements OnInit, OnDestroy {

  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  orderChangeC: ComponentRef<OrderCollectionChangeComponent>
  @Output() changeEmit: EventEmitter<ElementPriceName[]> = new EventEmitter<ElementPriceName[]>()
  @Input() priceNames: ElementPriceName[]
  formData: FormGroup
  subChanges: Subscription
  pauseForm: boolean = false

  constructor(private fb: FormBuilder, private cf: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.createForm();
    this.subChanges = this.formData.valueChanges.pipe(filter(_ => !this.pauseForm)).subscribe(v => {
      // console.log(v)
      this.changeEmit.emit(<ElementPriceName[]>v.priceNames)
    });
  }

  createForm() {
    this.formData = this.fb.group({
      priceNames: this.createPriceNamesArray()
    })
  }

  createPriceNamesArray(): FormArray {
    var array = this.fb.array([])
    this.priceNames.map(pn => {
      array.push(
        this.fb.group({
          name: [pn.name],
          shortName: [pn.shortName],
          desc: [pn.desc],
          options: this.createOptions(pn.options),
          price: this.createPrices(pn.price)
        })
      )
    })
    return array
  }

  createOptions(options: string[]): FormArray {
    var array: FormArray = this.fb.array([]);
    options.map(op => {
      array.push(new FormControl(op))
    })
    return array;
  }

  createPrices(prices: ElementPrice[]): FormArray {
    var array: FormArray = this.fb.array([]);
    prices.map(p => {
      array.push(this.fb.group({
        perSize: [p.perSize],
        price: [p.price, [Validators.required, Validators.pattern('[0-9]+')]],
        isSea: [p.isSea]
      }))
    })
    return array
  }

  addPName() {
    (this.formData.get('priceNames') as FormArray)
      .push(
        this.fb.group({
          name: [''],
          shortName: [''],
          desc: [''],
          options: this.createOptions([]),
          price: this.createPrices([{ perSize: '', price: '', isSea: false }])
        })
      )
    this.formData.markAsUntouched()
  }

  removePN(i: number) {
    this.formData.get('priceNames')['controls'].splice(i, 1)
    this.formData.get('priceNames')['value'].splice(i, 1)
    this.changeEmit.emit(<ElementPriceName[]>this.formData.get('priceNames').value)
  }

  addOption(i: number) {
    (this.formData.get('priceNames')['controls'][i].get('options') as FormArray).push(new FormControl(''))
    this.formData.markAsUntouched()
  }

  removeOption(i: number, j: number) {
    this.formData.get('priceNames')['controls'][i].get('options')['controls'].splice(j, 1)
    this.formData.get('priceNames')['controls'][i].get('options')['value'].splice(j, 1)
    this.changeEmit.emit(<ElementPriceName[]>this.formData.get('priceNames').value)
  }

  changeOrder() {
    this.temp.clear()
    let list = this.cf.resolveComponentFactory(<Type<OrderCollectionChangeComponent>>OrderCollectionChangeComponent)
    this.orderChangeC = this.temp.createComponent(list)
    this.orderChangeC.instance.elements = this.priceNames
    this.orderChangeC.instance.presentType = PresentType.oneKey
    this.orderChangeC.instance.nameKey = 'name'
    this.orderChangeC.instance.emitChange.subscribe(r => {
      this.priceNames = r
      this.changeFormOrder()
    })
    this.orderChangeC.instance.emitClose.subscribe(r => {
      this.orderChangeC.destroy()
    })
  }

  changeFormOrder() {
    this.pauseForm = true;
    (this.formData.get('priceNames') as FormArray).clear();
    this.priceNames.map(pn => {
      (this.formData.get('priceNames') as FormArray).push(
        this.fb.group({
          name: [pn.name],
          shortName: [pn.shortName],
          desc: [pn.desc],
          options: this.createOptions(pn.options),
          price: this.createPrices(pn.price)
        })
      )
    })
    this.pauseForm = false;
    this.formData.markAsUntouched()
    this.changeEmit.emit(<ElementPriceName[]>this.formData.get('priceNames').value)
  }

  ngOnDestroy(): void {
    if (this.subChanges)
      this.subChanges.unsubscribe()
  }

}
