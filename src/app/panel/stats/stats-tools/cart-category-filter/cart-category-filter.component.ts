import { map } from 'rxjs/operators';
import { Subscription, Observable, from } from 'rxjs';
import { CartCategory } from './../../../../models/cart-category';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { QPElementsSales } from 'src/app/models/qp-elements-sales';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

interface CategoryValuesList {
  name: string,
  value: string
}

@Component({
  selector: 'app-cart-category-filter',
  templateUrl: './cart-category-filter.component.html',
  styleUrls: ['./cart-category-filter.component.scss']
})
export class CartCategoryFilterComponent implements OnInit, OnDestroy {

  @Output() emitChange: EventEmitter<string> = new EventEmitter<string>()
  @Input() cCIds: string
  @Input() cartCategories: CartCategory[] = []
  cValues: CategoryValuesList[] = []
  cValues$: Observable<CategoryValuesList>
  formC: FormGroup
  cs: string[] = []
  subCChange: Subscription
  subAllChange: Subscription
  subValues: Subscription

  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {
    this.prepareCValues()
    this.cValues$ = from(this.cValues)
    this.createForm()
    this.subscribeToCChange()
    this.subscribeAllChange()
  }

  createForm() {
    let all: boolean = this.cCIds == 'all'
    var cs: string[] = []
    if (all) {
      cs = this.cValues.map(c => c.value)
    } else if (this.cCIds != 'none') {
      cs = this.cCIds.split(',')
    }
    this.formC = this.fb.group({
      cartCategory: [cs],
      all: [all]
    })
  }

  subscribeToCChange() {
    this.subCChange = this.formC.get('cartCategory').valueChanges.subscribe(vs => {
      this.cs = vs
      if (this.cartCategories.length > vs.length) {
        this.formC.get('all').setValue(false, { emitEvent: false })
      }
      if (vs.length > 0) {
        this.emitChange.emit(vs.join(','))
      } else {
        this.emitChange.emit('none')
      }
    })
  }

  subscribeAllChange() {
    this.subAllChange = this.formC.get('all').valueChanges.subscribe(v => {
      if (v) {
        var cids = []
        this.subValues = this.cValues$
          .pipe(
            map(c => {
              return c.value
            })
          ).subscribe(id => {
            cids.push(id)
          })
        this.formC.get('cartCategory').setValue(cids, { emitEvent: false })
        this.emitChange.emit('all')
      } else {
        this.emitChange.emit('none')
        this.formC.get('cartCategory').setValue([], { emitEvent: false })
      }

    })

  }

  prepareCValues() {
    this.cartCategories.map(c => {
      this.cValues.push({
        name: c.name,
        value: String(c.id)
      })
    })
  }


  ngOnDestroy(): void {
    if (this.subCChange) this.subCChange.unsubscribe()
    if (this.subValues) this.subValues.unsubscribe()
    if (this.subAllChange) this.subAllChange.unsubscribe()
  }



}
