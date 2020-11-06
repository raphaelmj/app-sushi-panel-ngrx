import { OrderService } from './../../../../services/orders/order.service';
import { CartElement, PlusElement } from './../../../../models/cart-element';
import { Component, Input, OnInit } from '@angular/core';
import { CartOrder } from 'src/app/models/cart-order';

@Component({
  selector: 'app-order-square-element',
  templateUrl: './order-square-element.component.html',
  styleUrls: ['./order-square-element.component.scss']
})
export class OrderSquareElementComponent implements OnInit {

  @Input() element: CartElement
  @Input() order: CartOrder
  changeInProgress: boolean = false
  isPlusGrill: boolean = false

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.isPlusGrill = this.checkIsSomePlusGrill()
  }

  checkIsSomePlusGrill(): boolean {
    var bool = false
    if (this.element.plusElements) {
      this.element.plusElements.map((pl: PlusElement) => {
        if (pl.grill > 0) {
          bool = true
        }
      })
    }
    return bool
  }

  changeStatus() {
    var nStatus: boolean = !this.element.status
    this.element.status = nStatus
    this.changeInProgress = true
    this.orderService.changeElementStatus(nStatus, this.element.id).then(r => {
      this.changeInProgress = false
    })
  }

}
