import { concatMap, filter, map, mergeMap, skip, skipUntil } from 'rxjs/operators';
import { HistogramQueryResponse } from './../../../models/histogram-query-response';
import { StatsService } from './../../../services/stats/stats.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as dateTotal from "../../../models/date-total"
import { QPRevenue } from 'src/app/models/qp-revenue';
import { QPElementsSales } from 'src/app/models/qp-elements-sales';


@Component({
  selector: 'app-stats-revenue',
  templateUrl: './stats-revenue.component.html',
  styleUrls: ['./stats-revenue.component.scss']
})
export class StatsRevenueComponent implements OnInit, OnDestroy {

  qp: QPRevenue
  collection: dateTotal.DateTotal.HistogramResponse
  // initLoad: boolean = true
  subData: Subscription
  subRouteChange: Subscription
  opened: boolean = false

  constructor(private activatedRoute: ActivatedRoute, private statsService: StatsService, private router: Router) {
    this.collection = this.activatedRoute.snapshot.data['stats'].data
    this.qp = this.activatedRoute.snapshot.data['stats'].qp
  }

  ngOnInit(): void {
    this.subscribeToQPChange()
  }

  changeFilters(event: QPRevenue) {
    this.router.navigate(['panel/stats/revenue'], { queryParams: event })
  }

  subscribeToQPChange() {
    this.subRouteChange = this.activatedRoute.queryParams
      .pipe(
        skip(1),
        concatMap((qp: QPElementsSales) => this.getData(qp))
      )
      .subscribe((s: HistogramQueryResponse<dateTotal.DateTotal.HistogramResponse, QPRevenue>) => {
        this.collection = s.data
        this.qp = s.qp
      })
  }

  getData(qp: QPElementsSales): Observable<HistogramQueryResponse<dateTotal.DateTotal.HistogramResponse, QPRevenue>> {
    this.qp = qp
    var { from, to, cI } = qp
    return this.statsService.getDateTotal(from, to, cI)
  }

  ngOnDestroy(): void {
    if (this.subData) this.subData.unsubscribe()
    if (this.subRouteChange) this.subRouteChange.unsubscribe()
  }

}
