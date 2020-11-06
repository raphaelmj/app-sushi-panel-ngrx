import { Subscription } from 'rxjs';
import { OrderStatus } from './../../../../models/cart-order';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-status-states-select',
  templateUrl: './status-states-select.component.html',
  styleUrls: ['./status-states-select.component.scss']
})
export class StatusStatesSelectComponent implements OnInit, OnDestroy {

  @Output() changeStates: EventEmitter<Array<OrderStatus>> = new EventEmitter<Array<OrderStatus>>()
  @Input() sts: Array<OrderStatus>
  formSt: FormGroup
  subChange: Subscription

  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {
    this.createForm()
    this.subscribeToChange()
  }


  createForm() {
    this.formSt = this.fb.group({
      create: new FormControl(this.checkIsStateInArray(OrderStatus.create)),
      ready: new FormControl(this.checkIsStateInArray(OrderStatus.ready)),
      archive: new FormControl(this.checkIsStateInArray(OrderStatus.archive))
    })
  }

  subscribeToChange() {
    this.subChange = this.formSt.valueChanges.subscribe(v => {
      this.sts = this.createNewStateArray(v)
      this.changeStates.emit(this.sts)
    })
  }

  checkIsStateInArray(s: OrderStatus): boolean {
    var bool: boolean = false
    this.sts.map(st => {
      if (s == st) {
        bool = true
      }
    })
    return bool
  }

  createNewStateArray(v: { create: boolean, ready: boolean, archive: boolean }): Array<OrderStatus> {
    var sts: Array<OrderStatus> = []
    if (v.create) {
      sts.unshift(OrderStatus.create)
    }
    if (v.ready) {
      sts.unshift(OrderStatus.ready)
    }
    if (v.archive) {
      sts.unshift(OrderStatus.archive)
    }
    return sts
  }

  ngOnDestroy(): void {
    if (this.subChange) this.subChange.unsubscribe()
  }

}
