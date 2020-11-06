import { MenuElement } from './../../../../../models/menu-element';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-desc-elements-bt,[app-desc-elements-bt]',
  templateUrl: './desc-elements-bt.component.html',
  styleUrls: ['./desc-elements-bt.component.scss']
})
export class DescElementsBtComponent implements OnInit {

  @Input() element: MenuElement

  constructor() { }

  ngOnInit(): void {
  }

  addToCart(i: number) {

  }

}
