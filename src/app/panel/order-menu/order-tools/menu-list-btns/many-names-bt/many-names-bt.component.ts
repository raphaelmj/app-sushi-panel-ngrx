import { MenuElement } from './../../../../../models/menu-element';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-many-names-bt,[app-many-names-bt]',
  templateUrl: './many-names-bt.component.html',
  styleUrls: ['./many-names-bt.component.scss']
})
export class ManyNamesBtComponent implements OnInit {

  @Input() element: MenuElement

  constructor() { }

  ngOnInit(): void {
  }

  addToCart(i: number) {

  }


}
