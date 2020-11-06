import { OrderService } from './orders/order.service';
import { NavService } from './auth/nav.service';
import { UserService } from './auth/user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [UserService, NavService, OrderService],
})
export class ServicesModule { }
