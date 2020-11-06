import { MenuElement } from './../../../../../models/menu-element';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-steps-many-bt,[app-config-steps-many-bt]',
  templateUrl: './config-steps-many-bt.component.html',
  styleUrls: ['./config-steps-many-bt.component.scss']
})
export class ConfigStepsManyBtComponent implements OnInit {

  @Input() element: MenuElement

  constructor() { }

  ngOnInit(): void {
  }


  addToCart() {

  }

}
