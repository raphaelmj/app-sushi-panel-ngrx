import { HistogramQueryResponse } from './../../../models/histogram-query-response';
import { DateHelperService } from './../../date/date-helper.service';
import { QPRevenue } from './../../../models/qp-revenue';
import { StatsService } from './../stats.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from "moment";
import * as dateTotal from "../../../models/date-total";
import { HistogramCalendarInterval } from 'src/app/models/histogram-calendar-interval';


@Injectable({
  providedIn: 'root'
})
export class RevenueResolveService implements Resolve<HistogramQueryResponse<dateTotal.DateTotal.HistogramResponse, QPRevenue>> {



  constructor(private statsService: StatsService, private dateHelperService: DateHelperService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<HistogramQueryResponse<dateTotal.DateTotal.HistogramResponse, QPRevenue>> {
    var qp: QPRevenue = this.prepareQueryParams(route)
    return this.statsService.getDateTotal(qp.from, qp.to, qp.cI)
  }

  prepareQueryParams(route: ActivatedRouteSnapshot): QPRevenue {
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
