import { tap } from 'rxjs/operators';
import { AppConfig, FilterState } from './../../../models/app-config';
import { UserRole } from './../../../models/user';
import { UserToken } from './../../../models/token-user';
import { OrderStatus, OrderStatusName } from './../../../models/cart-order';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { OrderQueryParams } from '../../../models/order-query-params';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from "moment";
import { Subscription, Observable, of } from 'rxjs';

export interface OptionStatus {
  name: OrderStatusName
  value: OrderStatus
  selected?: boolean
}

@Component({
  selector: 'app-orders-filters',
  templateUrl: './orders-filters.component.html',
  styleUrls: ['./orders-filters.component.scss']
})
export class OrdersFiltersComponent implements OnInit, OnDestroy, OnChanges {


  @Output() changeFilters: EventEmitter<OrderQueryParams> = new EventEmitter<OrderQueryParams>()
  @Input() data: { qp: OrderQueryParams, reservations: number, archives: number, inProgress: number }
  @Input() userToken: UserToken;
  @Input() appConfig: AppConfig;
  oQP: OrderQueryParams
  reservations: number = 0
  archives: number = 0
  inProgress: number = 0
  options: OptionStatus[] = [
    { name: OrderStatusName.create, value: OrderStatus.create },
    { name: OrderStatusName.ready, value: OrderStatus.ready },
    { name: OrderStatusName.archive, value: OrderStatus.archive },
  ];
  selectedOptions: string[] = []

  formFilters: FormGroup
  subDayChange: Subscription
  inProgressSteps: Array<'0' | '1' | 'all'> = ['0', '1', 'all']
  inProgressStepsIndex: number
  reservationsSteps: Array<'0' | '1' | 'all'> = ['0', '1', 'all']
  reservationsStepsIndex: number
  paidSteps: Array<'0' | '1' | 'all'> = ['0', '1', 'all']
  paidStepsIndex: number
  orderStatus = OrderStatus
  isAll: boolean = false

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {

  }


  ngOnInit(): void {
    this.oQP = this.data.qp
    this.reservations = this.data.reservations
    this.archives = this.data.archives
    this.inProgress = this.data.inProgress
    this.createForm()
    this.subscribeToDayChange()
    this.selectedOptions = this.oQP.sts.split('|');
    this.setActiveSelect()
    this.setStatusIndexes()
  }



  subscribeToDayChange() {
    this.subDayChange = this.formFilters.get('day').valueChanges.subscribe(v => {
      this.oQP.day = v.format("yy-MM-DD")
      this.emitAfterChange()
    })
  }


  createForm() {
    var day: moment.Moment = moment(this.oQP.day)
    this.formFilters = this.fb.group({
      day: new FormControl(day)
    })
  }

  setActiveSelect() {
    this.options.map((o, i) => {
      this.selectedOptions.map(so => {
        if (o.value == so) {
          this.options[i].selected = true
        }
      })
    })
  }


  selectUnselectStatus(i: number) {
    this.options[i].selected = (this.options[i].selected) ? false : true
    this.createSelectedOptions()

    if (this.selectedOptions.length == 0 || this.selectedOptions.length != this.options.length)
      this.isAll = false
    else
      this.isAll = true

    this.oQP.sts = this.selectedOptions.join('|')
    this.emitAfterChange()
  }

  createSelectedOptions() {
    this.selectedOptions = []
    this.options.map(op => {
      if (op.selected) {
        this.selectedOptions.push(op.value)
      }
    })
  }

  changeInProgress() {

    if (this.oQP.reservation == '1') {
      this.oQP.reservation = 'all'
      this.reservationsStepsIndex = this.findIndex(this.reservationsSteps, this.oQP.reservation)
    }

    var stepsLength: number = this.inProgressSteps.length
    if ((this.inProgressStepsIndex + 1) == stepsLength) {
      this.inProgressStepsIndex = 0
    } else {
      this.inProgressStepsIndex++
    }
    this.oQP.inprogress = this.inProgressSteps[this.inProgressStepsIndex]
    var { inprogress, ...rest } = this.getDefaultQueryParams(this.appConfig, <UserRole>this.userToken.role)

    switch (this.oQP.inprogress) {
      case '0':
        this.oQP = { ...this.oQP, ...rest }
        this.selectedOptions = this.oQP.sts.split('|')
        break;
      case '1':
        this.selectedOptions = []
        this.oQP.paid = '0'
        this.oQP.reservation = '0'
        break;
      case 'all':
        this.oQP = { ...this.oQP, ...rest }
        this.selectedOptions = this.oQP.sts.split('|')
        break;
    }

    this.setStatusIndexes()
    this.emitAfterChange()
  }

  changePaid() {

    var stepsLength: number = this.paidSteps.length

    if ((this.paidStepsIndex + 1) == stepsLength) {
      this.paidStepsIndex = 0
    } else {
      this.paidStepsIndex++
    }

    this.oQP.paid = this.paidSteps[this.paidStepsIndex]
    this.selectedOptions = this.oQP.sts.split('|')
    this.emitAfterChange()

  }


  changeReservation() {

    if (this.oQP.inprogress == '1') {
      this.oQP.inprogress = 'all'
      this.inProgressStepsIndex = this.findIndex(this.inProgressSteps, this.oQP.inprogress)
    }

    var stepsLength: number = this.reservationsSteps.length
    if ((this.reservationsStepsIndex + 1) == stepsLength) {
      this.reservationsStepsIndex = 0
    } else {
      this.reservationsStepsIndex++
    }
    this.oQP.reservation = this.reservationsSteps[this.reservationsStepsIndex]
    this.selectedOptions = this.oQP.sts.split('|')
    this.emitAfterChange()
  }


  selectAll() {
    this.selectedOptions = []
    this.options.map(op => {
      this.selectedOptions.push(op.value)
    })
    this.oQP.sts = this.selectedOptions.join('|')
    this.oQP.paid = 'all'
    this.oQP.reservation = 'all'
    this.oQP.inprogress = 'all'
    this.setActiveSelect()
    this.isAll = true
    this.setStatusIndexes()
    this.emitAfterChange()
  }

  clearAll() {
    this.selectedOptions = []
    this.options.map((o, i) => { this.options[i].selected = false })
    this.oQP.sts = this.selectedOptions.join('|')
    this.isAll = false
    this.oQP.paid = '0'
    this.oQP.reservation = '0'
    this.oQP.inprogress = '0'
    this.setStatusIndexes()
    this.emitAfterChange()
  }


  emitAfterChange() {
    this.changeFilters.emit(this.oQP)
  }

  findIndex(sts: string[], st: string): number {
    var index: number
    sts.map((s, i) => {
      if (s == st) {
        index = i
      }
    })
    return index
  }


  setStatusIndexes() {
    this.inProgressStepsIndex = this.findIndex(this.inProgressSteps, this.oQP.inprogress)
    this.reservationsStepsIndex = this.findIndex(this.reservationsSteps, this.oQP.reservation)
    this.paidStepsIndex = this.findIndex(this.reservationsSteps, this.oQP.reservation)
  }


  getDefaultQueryParams(appConfig: AppConfig, role: UserRole, page: number = 1): OrderQueryParams {

    var fstate: FilterState = (role == UserRole.admin) ? appConfig.data.defaultFiltersStates.admin : appConfig.data.defaultFiltersStates.waiter
    var qp: OrderQueryParams = {
      page: page,
      sts: fstate.sts.join('|'),
      paid: fstate.paid,
      reservation: fstate.reservation,
      inprogress: fstate.inprogress
    }
    return qp
  }

  ngOnDestroy(): void {
    if (this.subDayChange) this.subDayChange.unsubscribe()
  }

}
