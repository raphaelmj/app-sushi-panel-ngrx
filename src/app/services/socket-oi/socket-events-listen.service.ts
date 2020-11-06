import { UserToken } from './../../models/token-user';
import { RefreshAfterCronInprogressService } from './refresh-after-cron-inprogress.service';
import { RefreshAfterDeleteOrderService } from './refresh-after-delete-order.service';
import { OrderElementStatusChangeRefreshService } from './order-element-status-change-refresh.service';
import { GetDataOrdersRefreshService } from './get-data-orders-refresh.service';
import { CartOrder } from '../../models/cart-order';
import { Injectable, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Howl, Howler } from 'howler';

export interface SocketOrderResponse {
  order: CartOrder
  uuid: string
}


@Injectable({
  providedIn: 'root'
})
export class SocketEventsListenService {

  subOrderCreate: Subscription
  subOrderCreateFront: Subscription
  subOrderUpdate: Subscription
  subOrderQuietUpdate: Subscription
  subOrderReady: Subscription
  subOrderUpdateStatus: Subscription
  subOrderUpdateElementStatus: Subscription
  subOrderUpdateTime: Subscription
  subOrderDelete: Subscription
  subBonusUsed: Subscription
  subChangeInProgress: Subscription
  userToken: UserToken

  s1: Howl;
  s2: Howl;
  s3: Howl;
  s4: Howl;
  s5: Howl;

  constructor(
    private socket: Socket,
    private ngZone: NgZone,
    private getDataOrdersRefreshService: GetDataOrdersRefreshService,
    private orderElementStatusChangeRefreshService: OrderElementStatusChangeRefreshService,
    private refreshAfterDeleteOrderService: RefreshAfterDeleteOrderService,
    private refreshAfterCronInprogressService: RefreshAfterCronInprogressService
  ) {

    this.s1 = new Howl({
      src: ['assets/ping.mp3']
    });
    this.s2 = new Howl({
      src: ['assets/end.mp3']
    });
    this.s3 = new Howl({
      src: ['assets/change.mp3']
    });
    this.s4 = new Howl({
      src: ['assets/bonus.mp3']
    });
    this.s5 = new Howl({
      src: ['assets/inprogress.mp3']
    });
  }

  startListen(userToken: UserToken) {
    this.userToken = userToken
    this.listenOrderCreate()
    this.listenChangeOrder();
    this.listenQuietChangeOrder();
    this.listenToReadyIfWaiter();
    this.listenToOrderStatusChange();
    this.listenToOrderElementStatusChange();
    this.listenToTimeChange();
    this.listenToOrderDelete();
    this.listenBonusUsed()
    this.listenInProgress()
  }

  listenOrderCreate() {
    this.subOrderCreate = this.socket
      .fromEvent("orderCreateFront")
      .pipe(map((data) => data)).subscribe((data: SocketOrderResponse) => {
        this.ngZone.run(() => {
          this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
          if (this.userToken.role == 'admin') {
            this.s1.play()
          }
        })
      })
  }

  listenChangeOrder() {

    this.subOrderUpdate = this.socket
      .fromEvent("orderUpdate")
      .pipe(map((data) => data)).subscribe((data: SocketOrderResponse) => {
        this.ngZone.run(() => {
          this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
          if (this.userToken.role == 'admin') {
            this.s3.play()
          }
        })
      })
  }

  listenQuietChangeOrder() {

    this.subOrderQuietUpdate = this.socket
      .fromEvent("orderQuietUpdate")
      .pipe(map((data) => data)).subscribe((data: SocketOrderResponse) => {
        this.ngZone.run(() => {
          this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
        })
      })
  }

  listenToReadyIfWaiter() {
    if (this.userToken.role == "waiter") {
      this.subOrderReady = this.socket
        .fromEvent("orderReady")
        .pipe(map((data) => data)).subscribe((data: SocketOrderResponse) => {
          this.ngZone.run(() => {
            this.s2.play()
          })
        })
    }

  }

  listenToOrderStatusChange() {
    this.subOrderUpdateStatus = this.socket
      .fromEvent("orderUpdateStatus")
      .pipe(map((data) => data)).subscribe((data: SocketOrderResponse) => {
        this.ngZone.run(() => {
          this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
        })
      })
  }

  listenToOrderElementStatusChange() {
    this.subOrderUpdateElementStatus = this.socket
      .fromEvent("orderUpdateElementStatus")
      .pipe(map((data) => data)).subscribe((data: { orderId: number; elementId: number; status: boolean }) => {
        this.ngZone.run(() => {
          this.orderElementStatusChangeRefreshService.updateStatus(data);
        })
      })

  }


  listenToTimeChange() {
    this.subOrderUpdateTime = this.socket
      .fromEvent("orderUpdateTime")
      .pipe(map((data) => data)).subscribe((data: SocketOrderResponse) => {
        this.ngZone.run(() => {
          this.s3.play()
          this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
        })
      })
  }

  listenToOrderDelete() {

    this.subOrderDelete = this.socket
      .fromEvent("orderDelete")
      .pipe(map((data) => data)).subscribe((data: SocketOrderResponse) => {
        this.ngZone.run(() => {
          this.s3.play()
          this.refreshAfterDeleteOrderService.updateAfterDelete(data.uuid)
        })
      })

  }


  listenBonusUsed() {
    this.subBonusUsed = this.socket
      .fromEvent("bonusUsed")
      .pipe(map((data) => data)).subscribe((data: SocketOrderResponse) => {
        this.ngZone.run(() => {
          if (data.order.bonusUsed) {
            this.s4.play()
          }
          this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
        })
      })
  }

  listenInProgress() {
    this.subChangeInProgress = this.socket
      .fromEvent("changeInProgress")
      .pipe(map((data) => data)).subscribe((data: { isChanged: boolean }) => {
        this.ngZone.run(() => {
          if (this.userToken.role == "admin") {
            if (data.isChanged) {
              this.s5.play()
            }
          }
          this.refreshAfterCronInprogressService.emitRefresh(data.isChanged)
        })
      })
  }

  unsubscribeAll() {
    if (this.subOrderCreate) this.subOrderCreate.unsubscribe()
    if (this.subOrderUpdate) this.subOrderUpdate.unsubscribe()
    if (this.subOrderQuietUpdate) this.subOrderQuietUpdate.unsubscribe()
    if (this.subOrderReady) this.subOrderReady.unsubscribe()
    if (this.subOrderUpdateStatus) this.subOrderUpdateStatus.unsubscribe()
    if (this.subOrderUpdateElementStatus) this.subOrderUpdateElementStatus.unsubscribe()
    if (this.subOrderUpdateTime) this.subOrderUpdateTime.unsubscribe()
    if (this.subOrderDelete) this.subOrderDelete.unsubscribe()
    if (this.subBonusUsed) this.subBonusUsed.unsubscribe()
    if (this.subChangeInProgress) this.subChangeInProgress.unsubscribe()
  }

}
