import { AppConfig } from 'src/app/models/app-config';
import { CalculateService } from './../../../services/calculate/calculate.service';
import { BonusSetConfigComponent, BonusResponseData } from './../../../orders-tools/bonus-set-config/bonus-set-config.component';
import { SelectTimeComponent, TimeModel } from './../../../tools/select-time/select-time.component';
import { SelectOption, SelectOptionComponent, SelectOptionsInputData } from './../../../tools/material-dialog/select-option/select-option.component';
import { ConfirmByInputDataComponent, InputConfirmType, InputConfirmResponse } from './../../../tools/confirm-by-input-data/confirm-by-input-data.component';
import { ConfirmWindowComponent } from './../../../tools/confirm-window/confirm-window.component';
import { RefreshOrdersService } from './../../../services/refresh-orders.service';
import { OrderService } from './../../../services/orders/order.service';
import { element } from 'protractor';
import { OrderElementStatusChangeRefreshService } from './../../../services/socket-oi/order-element-status-change-refresh.service';
import { DatePosition, OrderStatus, OrderActionTypeNames, OrderActionType, OrderStatusName, BonusType } from './../../../models/cart-order';
import { Component, Input, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CartOrder } from 'src/app/models/cart-order';
import * as moment from "moment";
import { preciseDiff } from "moment-precise-range-plugin"
require("moment-precise-range-plugin");
import { DateDiff } from "../../../models/date-diff";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-board-square',
  templateUrl: './order-board-square.component.html',
  styleUrls: ['./order-board-square.component.scss']
})
export class OrderBoardSquareComponent implements OnInit, OnDestroy {

  @ViewChild('temp', { read: ViewContainerRef }) temp: ViewContainerRef
  confirmC: ComponentRef<ConfirmWindowComponent>
  confirmInputC: ComponentRef<ConfirmByInputDataComponent>
  selectTimeC: ComponentRef<SelectTimeComponent>
  bonusSetConfigC: ComponentRef<BonusSetConfigComponent>
  @Input() order: CartOrder
  @Input() day: Date;
  @Input() appConfig: AppConfig
  baseTotal: number
  bonusType = BonusType

  subInterval: Subscription;
  subStatusChange: Subscription
  subActionTypeDialog: Subscription
  subStatusDialog: Subscription
  subPlusMinutesDialog: Subscription
  subTimeClose: Subscription
  subTimeChange: Subscription
  subBonusClose: Subscription
  subBonusChange: Subscription
  datePosition: DatePosition
  diff: DateDiff;
  isOrderInfoEmpty: boolean = true

  constructor(
    private orderElementStatusChangeRefreshService: OrderElementStatusChangeRefreshService,
    private orderService: OrderService,
    private refreshOrdersService: RefreshOrdersService,
    private cf: ComponentFactoryResolver,
    public dialog: MatDialog,
    private calculateService: CalculateService
  ) { }

  ngOnInit(): void {
    this.createTimeLimit()
    this.subToInterval()
    this.subscribeStatusChange()
    this.findDayPos()
    this.isOrderInfoEmpty = this.checkIsOrderInfoEmpty(this.order)
  }

  createTimeLimit() {
    var currentDate = moment(new Date());
    var endDate = moment(new Date(this.order.endAt));
    this.diff = moment.preciseDiff(currentDate, endDate, true);
  }

  subscribeStatusChange() {
    this.subStatusChange = this.orderElementStatusChangeRefreshService.action$.subscribe(o => {
      // console.log(o.orderId)
      if (o.orderId == this.order.id) {
        this.order.cartOrderElements.map((el, i) => {
          if (el.id == o.elementId) {
            this.order.cartOrderElements[i].status = o.status
          }
        })
      }
    })
  }

  subToInterval() {
    this.subInterval = interval(1000).subscribe((n) => {
      this.createTimeLimit();
    });
  }

  findDayPos() {
    var currentDay = moment(moment(this.day).format('YYYY-MM-DD'));
    var orderDay = moment(this.order.endDay)
    if (orderDay.isBefore(currentDay)) {
      this.datePosition = DatePosition.before
    } else if (orderDay.isAfter(currentDay)) {
      this.datePosition = DatePosition.after
    } else if (orderDay.isSame(currentDay)) {
      this.datePosition = DatePosition.now
    }
  }

  checkIsOrderInfoEmpty(order: CartOrder): boolean {
    return (order.description == '' && order.forWho == '' && (order.phone == '' || !order.phone))
  }


  changeActionType() {
    var options: SelectOption<OrderActionType>[] = [
      { name: OrderActionTypeNames.onSite, value: OrderActionType.onSite, selected: (this.order.actionType == OrderActionType.onSite) },
      { name: OrderActionTypeNames.takeAway, value: OrderActionType.takeAway, selected: (this.order.actionType == OrderActionType.takeAway) }
    ]
    var data: SelectOptionsInputData<OrderActionType> = {
      options,
      customConfig: {
        showTitle: true
      }
    }
    const dialogRef = this.dialog.open(SelectOptionComponent, {
      width: '250px',
      data: data
    });
    this.subActionTypeDialog = dialogRef.afterClosed().subscribe((result: SelectOption<OrderActionType>) => {
      if (result) {
        this.orderService
          .changeOrderField("actionType", result.value, this.order.id)
          .then((r) => {
            this.order.actionType = result.value;
          });
      }
    });
  }

  changeStatus() {
    var options: SelectOption<OrderStatus>[] = [
      { name: OrderStatusName.create, value: OrderStatus.create, selected: (this.order.status == OrderStatus.create) },
      { name: OrderStatusName.ready, value: OrderStatus.ready, selected: (this.order.status == OrderStatus.ready) },
      { name: OrderStatusName.archive, value: OrderStatus.archive, selected: (this.order.status == OrderStatus.archive) },
    ]
    var data: SelectOptionsInputData<OrderStatus> = {
      options,
      customConfig: {
        showTitle: true
      }
    }
    const dialogRef = this.dialog.open(SelectOptionComponent, {
      width: '250px',
      data: data
    });
    this.subStatusDialog = dialogRef.afterClosed().subscribe((result: SelectOption<OrderStatus>) => {
      if (result) {
        this.orderService.changeOrderStatus(result.value, this.order.id).then((r) => {
          this.order.status = result.value;
        });
      }
    });
  }


  plusMinutes() {
    // var endDate: Date = new Date(this.order.endAt);
    // var m = moment(endDate)
    var options: SelectOption<number>[] = [
      { name: '+ 10 minut', value: 10 },
      { name: '+ 20 minut', value: 20 },
      { name: '+ 30 minut', value: 20 },
      { name: '+ 45 minut', value: 45 },
      { name: '+ 60 minut', value: 60 },
      { name: '+ 90 minut', value: 90 },
      { name: '+ 120 minut', value: 120 },
      { name: '+ 180 minut', value: 180 }
    ]
    var data: SelectOptionsInputData<number> = {
      options,
      customConfig: {
        showTitle: false
      }
    }
    const dialogRef = this.dialog.open(SelectOptionComponent, {
      width: '250px',
      data: data
    });
    this.subPlusMinutesDialog = dialogRef.afterClosed().subscribe((result: SelectOption<OrderStatus>) => {
      if (result) {
        var endAt: Date = new Date(this.order.endAt);
        this.order.endAt = moment(endAt).add(result.value, "minutes").toDate();
        this.orderService
          .changeOrderDate(this.order.endAt, this.order.id)
          .then((r) => {
            // this.refreshOrdersService.makeRefresh()
          });
      }
    });
  }

  changeTime() {
    var endDate: Date = new Date(this.order.endAt);
    var m = moment(endDate)
    let d = this.cf.resolveComponentFactory(<Type<SelectTimeComponent>>SelectTimeComponent)
    this.selectTimeC = this.temp.createComponent(d)
    this.selectTimeC.instance.timeString = m.format('HH:mm')
    this.subTimeChange = this.selectTimeC.instance.emitChange.subscribe((time: TimeModel) => {

      var endDate: Date = new Date(this.order.endAt);
      var m = moment(endDate)
      m.hour(time.hours).minute(time.minutes).second(time.seconds)
      endDate = m.toDate()

      this.orderService
        .changeOrderDate(endDate, this.order.id)
        .then((r) => {
          // this.refreshOrdersService.makeRefresh()
        });

      this.selectTimeC.destroy()
    })
    this.subTimeClose = this.selectTimeC.instance.emitClose.subscribe(c => {
      this.selectTimeC.destroy()
    })
  }

  changeInProgress() {
    let inProgress: boolean = (this.order.inProgress) ? false : true
    this.orderService.changeOrderField('inProgress', inProgress, this.order.id).then(r => {
      this.order.inProgress = inProgress
    })
  }

  setAsReady() {
    var s: OrderStatus = OrderStatus.ready;
    if (this.order.status == OrderStatus.ready) {
      s = OrderStatus.create
    }
    this.orderService.changeOrderStatus(s, this.order.id).then((r) => {
      this.order.status = OrderStatus.ready;
      // this.refreshOrdersService.makeRefresh()
    });
  }

  setPaid() {
    var paid: boolean = (this.order.paid) ? false : true
    this.orderService.changeOrderField('paid', paid, this.order.id).then(r => {
      this.order.paid = paid
    })
  }

  showBonusConfig() {

    this.temp.clear()
    let conf = this.cf.resolveComponentFactory(<Type<BonusSetConfigComponent>>BonusSetConfigComponent)
    this.bonusSetConfigC = this.temp.createComponent<BonusSetConfigComponent>(conf)
    this.bonusSetConfigC.instance.total = this.calculateService.stringToNumber(this.order.total)
    this.bonusSetConfigC.instance.currentBonusType = this.order.bonusType
    this.bonusSetConfigC.instance.currentBonusPrice = this.order.currentBonusPrice
    this.bonusSetConfigC.instance.currentBonusPercent = this.order.currentBonusPercent
    this.bonusSetConfigC.instance.appConfig = this.appConfig
    this.subBonusChange = this.bonusSetConfigC.instance.emitChange.subscribe((d: BonusResponseData) => {
      var bonusUsed: boolean = (d.bonusType == BonusType.none) ? false : true
      this.orderService.bonusTypeSetUnset(this.order.id, bonusUsed, d.bonusType, d.currentBonusPercent).then(r => {

      })
      this.bonusSetConfigC.destroy()
    })
    this.subBonusClose = this.bonusSetConfigC.instance.emitClose.subscribe(r => {
      this.bonusSetConfigC.destroy()
    })
  }

  setBonus() {

    var ub: boolean = (this.order.bonusUsed) ? false : true
    this.setBonusStart(ub)

  }


  setBonusStart(bonus: boolean) {
    this.temp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmByInputDataComponent>>ConfirmByInputDataComponent)
    this.confirmInputC = this.temp.createComponent<ConfirmByInputDataComponent>(confirm)
    this.confirmInputC.instance.bundleData = bonus
    this.confirmInputC.instance.confirmName = 'Zatwierdź'
    this.confirmInputC.instance.message = ''
    this.confirmInputC.instance.type = InputConfirmType.randomNumber
    this.confirmInputC.instance.emitActionConfirm.subscribe((d: InputConfirmResponse) => {
      if (d.do) {
        this.confirmInputC.destroy()
        this.orderService.bonusSetUnset(this.order.id, d.bundleData).then((o: CartOrder) => {
          this.order = { ...this.order, ...{ bonusUsed: o.bonusUsed, bonusTotal: o.bonusTotal, paid: o.paid } }
        })
      } else {
        this.confirmInputC.destroy()
      }
    })
  }

  toArchive() {
    var status: OrderStatus = OrderStatus.archive;
    if (this.order.status == OrderStatus.archive) {
      status = OrderStatus.create;
    }
    this.orderService.changeOrderStatus(status, this.order.id).then((r) => {
      this.order.status = status;
      this.refreshOrdersService.makeRefresh()
    });
  }

  ngOnDestroy(): void {
    if (this.subInterval) this.subInterval.unsubscribe();
    if (this.subStatusChange) this.subStatusChange.unsubscribe();
    if (this.subActionTypeDialog) this.subActionTypeDialog.unsubscribe()
    if (this.subStatusDialog) this.subStatusDialog.unsubscribe()
    if (this.subPlusMinutesDialog) this.subPlusMinutesDialog.unsubscribe()
    if (this.subTimeClose) this.subTimeClose.unsubscribe()
    if (this.subTimeChange) this.subTimeChange.unsubscribe()
    if (this.subBonusClose) this.subBonusClose.unsubscribe()
    if (this.subBonusChange) this.subBonusChange.unsubscribe()
  }

}
