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
import { Subscription, Observable, interval } from 'rxjs';
import { OrderStatus, OrderStatusName } from './../../models/cart-order';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  orders: CartOrder[] = [];
  total: number = 0;
  pages: number = 0;
  appConfig: AppConfig
  subOrders: Subscription;
  subRoute: Subscription;
  subRefresh: Subscription;
  subDataChange: Subscription;
  userToken: UserToken

  reservations: number
  archives: number
  inProgress: number
  listInProgress: boolean = false
  load: boolean = true;



  selectedStatusOptions: string[];
  currentDay: Date;
  subDay: Subscription;
  subDeleteOrder: Subscription
  subInProgress: Subscription
  dayInterval: Observable<number> = interval(1000 * 60);


  constructor(
    private activatedRoute: ActivatedRoute,
    private getDataOrdersRefreshService: GetDataOrdersRefreshService,
    private orderService: OrderService,
    private socketEventsListenService: SocketEventsListenService,
    private router: Router,
    private refreshAfterCronInprogressService: RefreshAfterCronInprogressService,
    private refreshAfterDeleteOrderService: RefreshAfterDeleteOrderService
  ) {
    this.oQP = this.activatedRoute.snapshot.data["ordersData"].qp;
    this.selectedStatusOptions = this.oQP.sts.split("|");
    this.orders = this.activatedRoute.snapshot.data["ordersData"].orders;
    this.userToken = this.activatedRoute.snapshot.data["user"];
    this.total = this.activatedRoute.snapshot.data["ordersData"].total;
    this.reservations = this.activatedRoute.snapshot.data["ordersData"].reservations
    this.archives = this.activatedRoute.snapshot.data["ordersData"].archives
    this.inProgress = this.activatedRoute.snapshot.data["ordersData"].inProgress
    this.appConfig = this.activatedRoute.snapshot.data['config']
    this.currentDay = moment(this.oQP.day).toDate();
    this.countPages();
    this.socketEventsListenService.startListen(this.userToken)
  }

  ngOnInit(): void {
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
      // console.log(r)
      if (r.isChanged) {
        this.getData();
      }
    })
  }

  changeDataSubscribe() {
    this.subDataChange = this.getDataOrdersRefreshService.action$.subscribe((bool) => {
      // console.log(bool.bool)
      if (bool.bool) {
        // if (bool.uuid != device.uuid) {
        this.getData();
        // }
      }
    });
  }

  refreshAfterDeleteSubscribe() {
    this.subDeleteOrder = this.refreshAfterDeleteOrderService.action$.subscribe(r => {
      this.getData();
    })
  }

  routeChangeWatch() {
    this.subRoute = this.activatedRoute.queryParams.subscribe((qp: OrderQueryParams) => {
      if (!this.load) {
        this.oQP = { ...this.oQP, ...qp }
        this.getOrders(this.oQP);
      } else {
        this.load = false;
      }
    });
  }

  changePage(p: NavPage) {
    this.router.navigate(["/panel/orders-board"], {
      queryParams: { page: p.nr, sts: this.oQP.sts, day: this.oQP.day, paid: this.oQP.paid, reservation: this.oQP.reservation, inprogress: this.oQP.inprogress },
    });
  }

  changeFilters(oQP: OrderQueryParams) {
    this.oQP = oQP
    this.currentDay = moment(this.oQP.day).toDate();
    this.router.navigate(["/panel/orders-board"], {
      queryParams: { page: 1, sts: this.oQP.sts, day: this.oQP.day, paid: this.oQP.paid, reservation: this.oQP.reservation, inprogress: this.oQP.inprogress },
    });
  }

  refreshData() {
    this.oQP.page = 1;
    this.getData(true);
  }

  getOrders(qp: OrderQueryParams) {
    this.oQP = Object.assign({}, qp)
    this.getData(true);
  }

  countPages() {
    if (this.total != 0) {
      this.pages = Math.ceil(this.total / LIMIT);
    } else {
      this.pages = 1;
    }
  }

  getData(pageOrRefresh: boolean = false) {

    if (pageOrRefresh)
      this.listInProgress = true

    this.subOrders = this.orderService.getOrders(this.oQP).subscribe(data => {
      this.total = data.total;
      this.orders = data.orders;
      this.oQP = data.qp;
      this.reservations = data.reservations
      this.archives = data.archives
      this.inProgress = data.inProgress
      this.countPages();
      if (pageOrRefresh)
        this.listInProgress = false

      if (this.pages < Number(this.oQP.page)) {
        this.oQP.page = Number(this.oQP.page) - 1;
        this.getData();
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subOrders) this.subOrders.unsubscribe()
    if (this.subRefresh) this.subRefresh.unsubscribe()
    if (this.subRoute) this.subRoute.unsubscribe()
    this.socketEventsListenService.unsubscribeAll()
  }



}
