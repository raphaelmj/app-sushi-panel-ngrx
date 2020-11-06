import { filter } from 'rxjs/operators';
import { OrderCollectionChangeComponent, PresentType } from './../../../../tools/order-collection-change/order-collection-change.component';
import { ElementDesc } from './../../../../models/site';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-desc-elements',
  templateUrl: './desc-elements.component.html',
  styleUrls: ['./desc-elements.component.scss']
})
export class DescElementsComponent implements OnInit, OnDestroy {

  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  orderChangeC: ComponentRef<OrderCollectionChangeComponent>
  @Output() changeEmit: EventEmitter<ElementDesc[]> = new EventEmitter<ElementDesc[]>()
  @Input() descElements: ElementDesc[]
  formData: FormGroup
  subChanges: Subscription
  pauseForm: boolean = false

  constructor(private fb: FormBuilder, private cf: ComponentFactoryResolver) { }


  ngOnInit(): void {
    this.createForm()
    this.subscribeValueChanges()
  }

  subscribeValueChanges() {
    // if (this.subChanges)
    //   this.subChanges.unsubscribe()
    this.subChanges = this.formData.valueChanges.pipe(filter(_ => !this.pauseForm)).subscribe(v => {
      this.changeEmit.emit(<ElementDesc[]>v.descElements)
    })
  }

  createForm() {
    this.formData = this.fb.group({
      descElements: this.createDescArray()
    })
  }

  createDescArray(): FormArray {
    var array: FormArray = this.fb.array([]);
    this.descElements.map((de: ElementDesc) => {
      array.push(this.fb.group({
        info: [de.info],
        shortName: [de.shortName],
        price: [de.price],
        seaPrice: [de.seaPrice],
        isSea: [de.isSea],
        options: this.createOptions(de.options)
      }));
    });
    return array;
  }

  createOptions(options: string[]): FormArray {
    var array: FormArray = this.fb.array([]);
    options.map(op => {
      array.push(new FormControl(op))
    })
    return array;
  }

  addDesc() {
    (this.formData.get('descElements') as FormArray).push(
      this.fb.group({
        info: [''],
        shortName: [''],
        price: ['', [Validators.pattern('[0-9]+')]],
        seaPrice: ['', [Validators.pattern('[0-9]+')]],
        isSea: [false],
        options: this.createOptions([])
      })
    )
    this.formData.markAsUntouched()
  }

  removeDesc(i: number) {
    this.formData.get('descElements')['controls'].splice(i, 1)
    this.formData.get('descElements')['value'].splice(i, 1)
    this.changeEmit.emit(<ElementDesc[]>this.formData.get('descElements').value)
  }

  addOption(i: number) {
    (this.formData.get('descElements')['controls'][i].get('options') as FormArray).push(new FormControl(''))
    this.formData.markAsUntouched()
  }

  removeOption(i: number, j: number) {
    this.formData.get('descElements')['controls'][i].get('options')['controls'].splice(j, 1)
    this.formData.get('descElements')['controls'][i].get('options')['value'].splice(j, 1)
    this.changeEmit.emit(<ElementDesc[]>this.formData.get('descElements').value)
  }

  changeOrder() {
    this.temp.clear()
    let list = this.cf.resolveComponentFactory(<Type<OrderCollectionChangeComponent>>OrderCollectionChangeComponent)
    this.orderChangeC = this.temp.createComponent(list)
    this.orderChangeC.instance.elements = this.descElements
    this.orderChangeC.instance.presentType = PresentType.oneKey
    this.orderChangeC.instance.nameKey = 'info'
    this.orderChangeC.instance.emitChange.subscribe(r => {
      this.descElements = r
      this.changeFormOrder()
    })
    this.orderChangeC.instance.emitClose.subscribe(r => {
      this.orderChangeC.destroy()
    })
  }

  changeFormOrder() {
    this.pauseForm = true;
    (this.formData.get('descElements') as FormArray).clear();
    this.descElements.map(de => {
      (this.formData.get('descElements') as FormArray).push(
        this.fb.group({
          info: [de.info],
          shortName: [de.shortName],
          price: [de.price],
          seaPrice: [de.seaPrice],
          isSea: [de.isSea],
          options: this.createOptions(de.options)
        })
      )
    })
    this.pauseForm = false;
    this.formData.markAsUntouched()
    this.changeEmit.emit(<ElementDesc[]>this.formData.get('descElements').value)
  }

  ngOnDestroy(): void {
    if (this.subChanges)
      this.subChanges.unsubscribe()
  }

}
