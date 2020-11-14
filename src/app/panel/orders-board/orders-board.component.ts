import { tap, map, concatMap, skip, skipUntil, switchMap } from 'rxjs/operators';
import { AppConfig } from './../../models/app-config';
import { OrderElementStatusChangeRefreshService } from './../../services/socket-oi/order-element-status-change-refresh.service';
import { RefreshAfterDeleteOrderService } from './../../services/socket-oi/refresh-after-delete-order.service';
import { RefreshAfterCronInprogressService } from './../../services/socket-oi/refresh-after-cron-inprogress.service';
import { NavPage } from './../../tools/pagination/model/nav-page';
import { LIMIT } from './../../config';
import { SocketEventsListenService } from './../../services/socket-oi/socket-events-listen.service';
import { GetDataOrdersRefreshService } from './../../services/socket-oi/get-data-orders-refresh.service';
import { OrderQueryParams } from '../../models/order-query-params';
import { CartOrder } from '../../models/cart-order';
import { Subscription, Observable, interval, of, from } from 'rxjs';
import { OrderStatus, OrderStatusName } from './../../models/cart-order';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UserToken } from 'src/app/models/token-user';
import { OrderService } from 'src/app/services/orders/order.service';
import * as moment from "moment";

@Component({
  selector: 'app-orders-board',
  templateUrl: './orders-board.component.html',
  styleUrls: ['./orders-board.component.scss']
})
export class OrdersBoardComponent implements OnInit, OnDestroy {

  oQP: OrderQueryParams;
  data$: Observable<{ orders: CartOrder[], total: number, qp: OrderQueryParams, reservations: number, archives: number, inProgress: number }>
  filterData$: Observable<{ qp: OrderQueryParams, reservations: number, archives: number, inProgress: number }>
  pagData$: Observable<{ current: string | number, total: number }>
  orders$: Observable<CartOrder[]>

  appConfig: AppConfig
  subOrders: Subscription;
  subRoute: Subscription;
  subRefresh: Subscription;
  subDataChange: Subscription;
  userToken: UserToken
  listInProgress: boolean = false

  selectedStatusOptions: string[];
  currentDay: Date;
  subDay: Subscription;
  subDeleteOrder: Subscription
  subInProgress: Subscription
  dayInterval: Observable<number> = interval(1000 * 60);
  subData: Subscription


  constructor(
    private activatedRoute: ActivatedRoute,
    private getDataOrdersRefreshService: GetDataOrdersRefreshService,
    private orderService: OrderService,
    private socketEventsListenService: SocketEventsListenService,
    private router: Router,
    private refreshAfterCronInprogressService: RefreshAfterCronInprogressService,
    private refreshAfterDeleteOrderService: RefreshAfterDeleteOrderService,
    private cdRef: ChangeDetectorRef
  ) {
    this.userToken = this.activatedRoute.snapshot.data["user"];
    this.appConfig = this.activatedRoute.snapshot.data['config']
    this.socketEventsListenService.startListen(this.userToken)


    // this.data$ = of(this.activatedRoute.snapshot.data["ordersData"])
  }

  ngOnInit(): void {
    this.data$ = of(this.activatedRoute.snapshot.data["ordersData"])
      .pipe(
        tap(d => {
          let { orders, ...f } = d
          this.filterData$ = of(f)
          this.pagData$ = of({ current: d.qp.page, total: d.total })
          this.oQP = d.qp
          this.currentDay = moment(this.oQP.day).toDate();
          this.cdRef.detectChanges()
        })
      )
    this.subscribeToOrdersChange();
    this.refreshInProgressSubscribe();
    this.changeDataSubscribe();
    this.refreshAfterDeleteSubscribe();
    this.routeChangeWatch();
  }

  subscribeToOrdersChange() {
    this.subRefresh = this.getDataOrdersRefreshService.action$.subscribe((d: { bool: boolean, uuid: string, order: CartOrder }) => {
      this.getData()
    })
  }

  refreshInProgressSubscribe() {
    this.subInProgress = this.refreshAfterCronInprogressService.action$.subscribe((r: { isChanged: boolean }) => {
      if (r.isChanged) {
        this.getData();
      }
    })
  }

  changeDataSubscribe() {
    this.subDataChange = this.getDataOrdersRefreshService.action$.subscribe((bool) => {
      if (bool.bool) {
        this.getData()
      }
    });
  }

  refreshAfterDeleteSubscribe() {
    this.subDeleteOrder = this.refreshAfterDeleteOrderService.action$.subscribe(r => {
      this.getData();
    })
  }

  routeChangeWatch() {

    // this.data$ = this.activatedRoute.queryParams
    //   .pipe(
    //     switchMap(qp => {
    //       return this.getDataO(true, <OrderQueryParams>qp)
    //     })
    //   )

    this.subRoute = this.activatedRoute.queryParams
      .pipe(
        skip(1)
      )
      .subscribe((qp: OrderQueryParams) => {
        this.data$ = this.getDataObs(true, <OrderQueryParams>qp)
      });
  }

  changePage(p: NavPage) {
    this.oQP.page = p.nr
    this.router.navigate(["/panel/orders-board"], {
      queryParams: this.oQP,
    });
  }

  changeFilters(oQP: OrderQueryParams) {
    this.oQP = oQP
    this.oQP.page = 1
    this.router.navigate(["/panel/orders-board"], {
      queryParams: this.oQP
    });
  }

  refreshData() {
    this.oQP.page = 1;
    this.getData(true);
  }



  getData(pageOrRefresh: boolean = false) {
    this.data$ = this.getDataObs(pageOrRefresh, this.oQP)
  }

  getDataObs(pageOrRefresh: boolean = false, oQP: OrderQueryParams): Observable<{ orders: CartOrder[], total: number, qp: OrderQueryParams, reservations: number, archives: number, inProgress: number }> {

    if (pageOrRefresh)
      this.listInProgress = true

    return this.orderService.getOrders(oQP)
      .pipe(
        tap(
          d => {
            let { orders, ...f } = d
            this.filterData$ = of(f)
            this.pagData$ = of({ current: d.qp.page, total: d.total })
            this.listInProgress = false
            this.oQP = d.qp
            this.currentDay = moment(this.oQP.day).toDate();
            let pages: number = (d.total != 0) ? Math.ceil(d.total / LIMIT) : 1
            if (pages < Number(d.qp.page)) {
              this.oQP.page = Number(d.qp.page) - 1;
              this.getData();
            }
          }
        )
      )
  }

  ngOnDestroy(): void {
    if (this.subOrders) this.subOrders.unsubscribe()
    if (this.subRefresh) this.subRefresh.unsubscribe()
    if (this.subRoute) this.subRoute.unsubscribe()
    if (this.subData) this.subData.unsubscribe()
    this.socketEventsListenService.unsubscribeAll()
  }



}
