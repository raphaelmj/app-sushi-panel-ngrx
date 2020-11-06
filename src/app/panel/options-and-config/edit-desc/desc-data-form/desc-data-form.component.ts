import { ChangeStringsOrderComponent } from './../../change-strings-order/change-strings-order.component';
import { element } from 'protractor';
import { Sortable } from 'sortablejs';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { DescOptions } from './../../../../models/desc-options';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Inject, OnChanges, SimpleChanges, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-desc-data-form',
  templateUrl: './desc-data-form.component.html',
  styleUrls: ['./desc-data-form.component.scss']
})
export class DescDataFormComponent implements OnInit, OnDestroy {

  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  changeSOC: ComponentRef<ChangeStringsOrderComponent>
  @Output() emitChange: EventEmitter<{ data: DescOptions, index: number }> = new EventEmitter<{ data: DescOptions, index: number }>()
  @Input() element: DescOptions
  @Input() index: number
  formData: FormGroup
  subChange: Subscription
  pauseForm: boolean = false

  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private cf: ComponentFactoryResolver
  ) { }


  ngOnInit(): void {
    this.createForm()
    this.subChange = this.formData.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        filter(_ => !this.pauseForm)
      )
      .subscribe(v => {
        if (this.formData.valid) {
          let el: DescOptions = { ...this.element, ...v }
          this.emitChange.emit({ data: el, index: this.index })
        }
      })

  }



  createForm() {
    this.formData = this.fb.group({
      name: [this.element.name, Validators.required],
      tags: this.createArray(this.element.tags)
    })
  }

  createArray(tags: string[]): FormArray {
    var array = this.fb.array([])
    tags.map(t => {
      array.push(new FormControl(t))
    })
    return array
  }

  addTag() {
    (this.formData.get('tags') as FormArray).push(new FormControl(''))
    this.formData.markAsUntouched()
  }

  removeTag(i: number) {
    this.formData.get('tags')['controls'].splice(i, 1)
    this.formData.get('tags')['value'].splice(i, 1)
    let el: DescOptions = { ...this.element, ...this.formData.value }
    this.emitChange.emit({ data: el, index: this.index })
  }

  openChangeOrder() {
    this.temp.clear()
    let pop = this.cf.resolveComponentFactory(<Type<ChangeStringsOrderComponent>>ChangeStringsOrderComponent)
    this.changeSOC = this.temp.createComponent(pop)
    this.changeSOC.instance.elements = this.formData.get('tags').value
    this.changeSOC.instance.emitClose.subscribe(r => {
      this.changeSOC.destroy()
    })
    this.changeSOC.instance.emitChange.subscribe(sts => {
      this.element.tags = sts
      this.changeOrder()
    })
  }

  changeOrder() {
    this.pauseForm = true;
    (this.formData.get('tags') as FormArray).clear();
    this.element.tags.map(t => {
      (this.formData.get('tags') as FormArray).push(new FormControl(t))
    })
    this.pauseForm = false;
    this.formData.markAsUntouched()
    let el: DescOptions = { ...this.element, ...this.formData.value }
    this.emitChange.emit({ data: el, index: this.index })
  }



  ngOnDestroy(): void {
    if (this.subChange)
      this.subChange.unsubscribe()
  }

}
