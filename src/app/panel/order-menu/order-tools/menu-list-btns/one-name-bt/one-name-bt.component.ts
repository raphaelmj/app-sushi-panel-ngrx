import { MenuElement } from './../../../../../models/menu-element';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-one-name-bt,[app-one-name-bt]',
  templateUrl: './one-name-bt.component.html',
  styleUrls: ['./one-name-bt.component.scss']
})
export class OneNameBtComponent implements OnInit {

  @Input() element: MenuElement

  constructor() { }

  ngOnInit(): void {
  }

  addToCart() {

  }

}
