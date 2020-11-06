import { ElementPrice } from './../../../../../models/site';
import { PriceConfigSort } from './../../../../../models/price-config-sort';
import { MenuElement } from './../../../../../models/menu-element';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-price-bt,[app-config-price-bt]',
  templateUrl: './config-price-bt.component.html',
  styleUrls: ['./config-price-bt.component.scss']
})
export class ConfigPriceBtComponent implements OnInit {

  @Input() element: MenuElement
  prices: PriceConfigSort[] = [];

  constructor() { }

  ngOnInit(): void {
    this.prices = this.preparePriceConfigArray(this.element.price);
  }

  addToCart() {

  }

  preparePriceConfigArray(price: ElementPrice[]): PriceConfigSort[] {
    var pConfig: PriceConfigSort[] = [];
    // arraySort(price, 'perSize')
    price.forEach((element, i) => {
      var isPer = false;

      pConfig.map((cel, j) => {
        if (cel.perSize == element.perSize) {
          isPer = true;
          pConfig[j].data.push({
            price: element.price,
            isSea: element.isSea,
            indexInElement: i,
          });
        }
      });

      if (!isPer) {
        var firstElement = [
          {
            price: element.price,
            isSea: element.isSea,
            indexInElement: i,
          },
        ];
        pConfig.push({
          perSize: element.perSize,
          data: firstElement,
        });

        // console.log(pConfig)
      }
    });

    return pConfig;
  }

  arraySortisSea(data: Array<{ price: string; isSea: boolean }>): Array<{ price: string; isSea: boolean }> {
    return data;
  }

}
