import { MenuElement } from './../../../../../models/menu-element';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-steps-bt,[app-config-steps-bt]',
  templateUrl: './config-steps-bt.component.html',
  styleUrls: ['./config-steps-bt.component.scss']
})
export class ConfigStepsBtComponent implements OnInit {

  @Input() element: MenuElement

  constructor() { }

  ngOnInit(): void {
  }


  addToCart() {

  }

}
