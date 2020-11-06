import { concatMap, map, skip, skipUntil } from 'rxjs/operators';
import { HistogramQueryResponse } from './../../../models/histogram-query-response';
import { StatsService } from './../../../services/stats/stats.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, pipe, Observable, from, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { QPElementsSales } from 'src/app/models/qp-elements-sales';
import * as elSales from "../../../models/elements-sales";
import { CartCategory } from 'src/app/models/cart-category';

@Component({
  selector: 'app-stats-elements-sales',
  templateUrl: './stats-elements-sales.component.html',
  styleUrls: ['./stats-elements-sales.component.scss']
})
export class StatsElementsSalesComponent implements OnInit, OnDestroy {

  qp: QPElementsSales
  collections: elSales.ElementsSales.HistogramResponseElement[]
  cartCategories: CartCategory[]
  hideLineIndexes: number[] = []
  // init$: Subject<boolean> = new Subject<boolean>()
  subData: Subscription
  subRouteChange: Subscription
  opened: boolean = false

  constructor(private activatedRoute: ActivatedRoute, private statsService: StatsService, private router: Router) {
    this.qp = this.activatedRoute.snapshot.data['stats'].qp
    this.collections = this.activatedRoute.snapshot.data['stats'].data
    this.cartCategories = this.activatedRoute.snapshot.data['cartCategories']
  }

  ngOnInit(): void {
    // this.init$.next(true)
    this.subscribeToQPChange()
  }

  subscribeToQPChange() {
    this.subRouteChange = this.activatedRoute.queryParams
      .pipe(
        skip(1),
        // skipUntil(this.init$),
        concatMap((qp: QPElementsSales) => this.getData(qp))
      )
      .subscribe((s: HistogramQueryResponse<elSales.ElementsSales.HistogramResponseElement[], QPElementsSales>) => {
        this.collections = s.data
        this.qp = s.qp
      })
  }

  changeFilters(event: QPElementsSales) {
    // this.init$.next(false)
    this.router.navigate(['panel/stats/elements-sales'], { queryParams: event })
  }

  changeCFilter(event: string) {
    var qp: QPElementsSales = { ...this.qp, ...{ cCIds: event } }
    // this.init$.next(false)
    this.router.navigate(['panel/stats/elements-sales'], { queryParams: qp })
  }

  getData(qp: QPElementsSales): Observable<HistogramQueryResponse<elSales.ElementsSales.HistogramResponseElement[], QPElementsSales>> {
    this.qp = qp
    var { from, to, cI, cCIds } = qp
    return this.statsService.getElementsSales(from, to, cI, cCIds)
  }


  ngOnDestroy(): void {
    if (this.subData) this.subData.unsubscribe()
    if (this.subRouteChange) this.subRouteChange.unsubscribe()
  }

}
