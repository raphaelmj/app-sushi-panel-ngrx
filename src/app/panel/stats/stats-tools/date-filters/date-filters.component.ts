import { QPElementsSales } from './../../../../models/qp-elements-sales';
import { HistogramCalendarInterval } from './../../../../models/histogram-calendar-interval';
import { map } from 'rxjs/operators';
import { pipe, Subscription } from 'rxjs';
import { QPRevenue } from './../../../../models/qp-revenue';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as moment from "moment"
import { keyframes } from '@angular/animations';

@Component({
  selector: 'app-date-filters',
  templateUrl: './date-filters.component.html',
  styleUrls: ['./date-filters.component.scss']
})
export class DateFiltersComponent implements OnInit, OnDestroy, OnChanges {

  @Output() emitChange: EventEmitter<QPRevenue | QPElementsSales> = new EventEmitter<QPRevenue | QPElementsSales>()
  @Input() qp: QPRevenue | QPElementsSales
  formFilters: FormGroup
  subChanges: Subscription
  firstFormChange: boolean = true
  types: Array<{ name: string, value: HistogramCalendarInterval }> = [
    { name: 'Dni', value: HistogramCalendarInterval.day },
    { name: 'Tygodnie', value: HistogramCalendarInterval.week },
    { name: 'Miesiące', value: HistogramCalendarInterval.month },
    { name: 'Kwartały', value: HistogramCalendarInterval.quarter },
    { name: 'Lata', value: HistogramCalendarInterval.year }
  ]
  startViewFrom: string = 'month'
  startViewTo: string = 'month'

  constructor(private fb: FormBuilder) {
  }


  ngOnInit(): void {
    this.createForm()
    this.subscribeChanges()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.qp) {
      if (!changes.qp.firstChange) {
        var qp: QPRevenue | QPElementsSales = changes.qp.currentValue
        var from: moment.Moment = moment(qp.from)
        var to: moment.Moment = moment(qp.to)
        // console.log(qp)
        this.formFilters.get('from').setValue(from, { emitEvent: false })
        this.formFilters.get('to').setValue(to, { emitEvent: false })
        // this.changePicerView()
      } else {
        // this.changePicerView()
      }
    }
  }


  subscribeChanges() {
    this.subChanges = this.formFilters.valueChanges
      .subscribe(v => {
        if (v.to.isBefore(v.from)) {
          this.formFilters.get('to').patchValue(Object.assign(v.from))
        }
        this.qp = { ...this.qp, ...{ from: v.from.format('yy-MM-DD'), to: v.to.format('yy-MM-DD'), cI: v.cI } }
        this.emitChange.emit(this.qp)
      })
  }

  createForm() {
    var from: moment.Moment = moment(this.qp.from)
    var to: moment.Moment = moment(this.qp.to)
    this.formFilters = this.fb.group({
      from: new FormControl(from),
      to: new FormControl(to),
      cI: new FormControl(this.qp.cI)
    })
  }


  fromFilter = (d: moment.Moment): boolean => {
    var nowDate: moment.Moment = moment()
    var to: moment.Moment = this.formFilters.get('to').value
    var cI: HistogramCalendarInterval = this.formFilters.get('cI').value
    var betweenBool: boolean = (d.isBefore(nowDate) || d.isSame(nowDate)) && (d.isBefore(to) || d.isSame(to))
    var interBool: boolean = true
    // switch (cI) {
    //   case HistogramCalendarInterval.day:
    //     break;
    //   case HistogramCalendarInterval.week:
    //     interBool = d.weekday() == 0
    //     break;
    //   case HistogramCalendarInterval.month:
    //     break;
    //   case HistogramCalendarInterval.quarter:
    //     interBool = (d.month() == 0 || d.month() == 2 || d.month() == 5 || d.month() == 8 && d.month() == 11) && d.date() == 1
    //     break;
    //   case HistogramCalendarInterval.year:
    //     break;
    // }
    return betweenBool && interBool
  }

  toFilter = (d: moment.Moment): boolean => {
    var nowDate: moment.Moment = moment()
    var from: moment.Moment = this.formFilters.get('from').value
    var cI: HistogramCalendarInterval = this.formFilters.get('cI').value
    var betweenBool: boolean = (d.isBefore(nowDate) || d.isSame(nowDate)) && (d.isAfter(from) || d.isSame(from))
    var interBool: boolean = true
    // switch (cI) {
    //   case HistogramCalendarInterval.day:
    //     break;
    //   case HistogramCalendarInterval.week:
    //     interBool = d.weekday() == 6
    //     break;
    //   case HistogramCalendarInterval.month:
    //     break;
    //   case HistogramCalendarInterval.quarter:
    //     interBool = (d.month() == 2 || d.month() == 2 || d.month() == 5 || d.month() == 8 && d.month() == 11) && d.date() == 1
    //     break;
    //   case HistogramCalendarInterval.year:
    //     break;
    // }
    return betweenBool && interBool
  }

  changePicerView() {
    switch (this.qp.cI) {
      case HistogramCalendarInterval.day:
        this.startViewFrom = 'month'
        this.startViewTo = 'month'
        break;
      case HistogramCalendarInterval.week:
        this.startViewFrom = 'month'
        this.startViewTo = 'month'
        break;
      case HistogramCalendarInterval.month:
        this.startViewFrom = 'year'
        this.startViewTo = 'year'
        break;
      case HistogramCalendarInterval.quarter:
        this.startViewFrom = 'year'
        this.startViewTo = 'year'
        break;
      case HistogramCalendarInterval.year:
        this.startViewFrom = 'multi-year'
        this.startViewTo = 'multi-year'
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.subChanges) this.subChanges.unsubscribe()
  }

}
