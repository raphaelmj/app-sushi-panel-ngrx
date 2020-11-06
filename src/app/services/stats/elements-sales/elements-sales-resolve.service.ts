import { HistogramQueryResponse } from './../../../models/histogram-query-response';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DateHelperService } from './../../date/date-helper.service';
import { StatsService } from './../stats.service';
import { Injectable } from '@angular/core';
import * as moment from "moment";
import * as elSales from "../../../models/elements-sales";
import { HistogramCalendarInterval } from '../../../models/histogram-calendar-interval';
import { QPElementsSales } from '../../../models/qp-elements-sales';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElementsSalesResolveService implements Resolve<HistogramQueryResponse<elSales.ElementsSales.HistogramResponseElement[], QPElementsSales>> {

  constructor(private statsService: StatsService, private dateHelperService: DateHelperService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): HistogramQueryResponse<elSales.ElementsSales.HistogramResponseElement[], QPElementsSales> | Observable<HistogramQueryResponse<elSales.ElementsSales.HistogramResponseElement[], QPElementsSales>> | Promise<HistogramQueryResponse<elSales.ElementsSales.HistogramResponseElement[], QPElementsSales>> {
    var qp: QPElementsSales = this.prepareQueryParams(route)
    qp.cCIds = (route.queryParams['cCIds']) ? route.queryParams['cCIds'] : ''
    return this.statsService.getElementsSales(qp.from, qp.to, qp.cI, qp.cCIds)
  }



  prepareQueryParams(route: ActivatedRouteSnapshot): QPElementsSales {
    let cI: HistogramCalendarInterval = (route.queryParams['cI']) ? route.queryParams['cI'] : HistogramCalendarInterval.day
    var week: { from: string, to: string } = this.dateHelperService.getWeekBettween(moment())
    var from: string = week.from
    var to: string = week.to

    if (this.dateHelperService.isDateStringValid(route.queryParams['from'])) {
      if (moment(route.queryParams['from']).isValid()) {
        from = moment(route.queryParams['from']).format('yy-MM-DD')
      } else {
        from = week.from
      }
    }
    if (this.dateHelperService.isDateStringValid(route.queryParams['to'])) {
      if (moment(route.queryParams['to']).isValid() && route.queryParams['to']) {
        to = moment(route.queryParams['to']).format('yy-MM-DD')
      } else {
        to = week.to
      }
    }

    if (moment(from).isAfter(moment(to))) {
      from = week.from
      to = week.to
      cI = HistogramCalendarInterval.day
    }
    return { from, to, cI }
  }

}
