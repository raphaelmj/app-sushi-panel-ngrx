import { Injectable } from '@angular/core';
import * as moment from "moment";
import { preciseDiff } from "moment-precise-range-plugin"
require("moment-precise-range-plugin");

@Injectable({
  providedIn: 'root'
})
export class DateHelperService {

  regexDate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

  constructor() { }

  getYearBeetween(date: string | number | Date | moment.Moment) {
    var m: moment.Moment = moment(date)
    console.log(m)
  }

  getMonthBeetween(date: string | number | Date | moment.Moment) {
    var m: moment.Moment = moment(date)
    console.log(m)
  }

  getWeekBettween(date: string | number | Date | moment.Moment): { from: string, to: string } {
    var m: moment.Moment = moment(date)
    var weeday: number = m.weekday()
    var startWeek: moment.Moment
    if (weeday > 0) {
      var forward: number = (weeday - 1)

      if (forward != 0) {
        startWeek = m.add(-forward, 'day')
      } else {
        startWeek = m
      }

    } else {
      startWeek = m.add(-6, 'day')
    }
    var endWeek: moment.Moment = moment(m).add(6, 'days')
    return {
      from: startWeek.format('yy-MM-DD'),
      to: endWeek.format('yy-MM-DD')
    }
  }

  isDateStringValid(s: string): boolean {
    return this.regexDate.test(s)
  }

}
