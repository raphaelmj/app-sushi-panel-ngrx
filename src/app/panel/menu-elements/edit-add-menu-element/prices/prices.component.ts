import { filter } from 'rxjs/operators';
import { OrderCollectionChangeComponent, PresentType } from './../../../../tools/order-collection-change/order-collection-change.component';
import { ElementPrice } from './../../../../models/site';
import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit, OnDestroy {

  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  orderChangeC: ComponentRef<OrderCollectionChangeComponent>
  @Output() changeEmit: EventEmitter<ElementPrice[]> = new EventEmitter<ElementPrice[]>()
  @Input() price: ElementPrice[]
  formData: FormGroup
  subChanges: Subscription
  pauseForm: boolean = false

  constructor(private fb: FormBuilder, private cf: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.createForm();
    this.subChanges = this.formData.valueChanges.pipe(filter(_ => !this.pauseForm)).subscribe(v => {
      this.changeEmit.emit(<ElementPrice[]>v.price)
    });
  }


  createForm() {
    this.formData = this.fb.group({
      price: this.createPrices(this.price)
    })
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


  addP() {
    (this.formData.get('price') as FormArray).push(this.fb.group({
      perSize: [''],
      price: [0, [Validators.required, Validators.pattern('[0-9]+')]],
      isSea: [false]
    }))
    this.formData.get('price').markAsUntouched()
  }

  changeOrder() {
    this.temp.clear()
    let list = this.cf.resolveComponentFactory(<Type<OrderCollectionChangeComponent>>OrderCollectionChangeComponent)
    this.orderChangeC = this.temp.createComponent(list)
    this.orderChangeC.instance.elements = this.price
    this.orderChangeC.instance.presentType = PresentType.manyKeys
    this.orderChangeC.instance.nameKeys = [{ key: 'price', suffix: ' pln' }, { key: 'perSize', suffix: ' szt.' }]
    this.orderChangeC.instance.emitChange.subscribe(r => {
      this.price = r
      this.changeFormOrder()
    })
    this.orderChangeC.instance.emitClose.subscribe(r => {
      this.orderChangeC.destroy()
    })
  }

  changeFormOrder() {
    this.pauseForm = true;
    (this.formData.get('price') as FormArray).clear();
    this.price.map(p => {
      (this.formData.get('price') as FormArray).push(
        this.fb.group({
          perSize: [p.perSize],
          price: [p.price, [Validators.required, Validators.pattern('[0-9]+')]],
          isSea: [p.isSea]
        })
      )
    })
    this.pauseForm = false;
    this.formData.markAsUntouched()
    this.changeEmit.emit(<ElementPrice[]>this.formData.get('price').value)
  }

  removeP(i: number) {
    this.formData.get('price')['controls'].splice(i, 1)
    this.formData.get('price')['value'].splice(i, 1)
    this.changeEmit.emit(<ElementPrice[]>this.formData.get('price').value)
  }

  ngOnDestroy(): void {
    if (this.subChanges)
      this.subChanges.unsubscribe()
  }

}
