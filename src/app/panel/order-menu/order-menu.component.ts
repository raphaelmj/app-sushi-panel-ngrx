import { Subscription } from 'rxjs';
import { WindowService } from './../../services/window.service';
import { AppConfig } from 'src/app/models/app-config';
import { MenuCategory } from 'src/app/models/menu-category';
import { CartCategory } from './../../models/cart-category';
import { DescOptions } from 'src/app/models/desc-options';
import { ReverseOptions } from 'src/app/models/reverse-options';
import { ActivatedRoute } from '@angular/router';
import { Component, HostListener, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UserToken } from 'src/app/models/token-user';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-order-menu',
  templateUrl: './order-menu.component.html',
  styleUrls: ['./order-menu.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class OrderMenuComponent implements OnInit, OnDestroy {

  userToken: UserToken
  elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] };
  plusCartCategories: CartCategory[]
  menuElementsFull: MenuCategory[] = [];
  cartCategories: CartCategory[] = [];
  appConfig: AppConfig
  opened: boolean;
  selectedIndex: number = 0
  innerWidth: number
  sub599: Subscription
  divNumber: number = 3

  constructor(private activatedRoute: ActivatedRoute, private windowService: WindowService, private observer: BreakpointObserver) {
    this.userToken = this.activatedRoute.snapshot.data["user"];
    this.elementOptions = this.activatedRoute.snapshot.data["options"];
    this.plusCartCategories = this.activatedRoute.snapshot.data["plusCartCategories"]
    this.cartCategories = this.activatedRoute.snapshot.data["cartCategories"];
    this.menuElementsFull = this.activatedRoute.snapshot.data["menuElements"];
    this.appConfig = this.activatedRoute.snapshot.data["config"];
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = this.windowService.windowRef.innerWidth
  }

  changeMenuTab(i: number) {
    this.selectedIndex = i + 1
  }

  ngOnInit(): void {
    this.innerWidth = this.windowService.windowRef.innerWidth
    this.sub599 = this.observer.observe('(max-width: 599.98px)').subscribe(result => {
      if (result.matches) {
        this.divNumber = 2
      } else {
        this.divNumber = 3
      }
    })
  }

  ngOnDestroy(): void {
    this.sub599.unsubscribe()
  }



}
