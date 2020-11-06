import { AppConfig } from 'src/app/models/app-config';
import { CalculateService } from './../../services/calculate/calculate.service';
import { BonusType } from './../../models/cart-order';
import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

export interface BonusResponseData {
  bonusType: BonusType
  currentBonusPrice: number
  currentBonusPercent: number
}

@Component({
  selector: 'app-bonus-set-config',
  templateUrl: './bonus-set-config.component.html',
  styleUrls: ['./bonus-set-config.component.scss']
})
export class BonusSetConfigComponent implements OnInit {


  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Output() emitChange: EventEmitter<BonusResponseData> = new EventEmitter<BonusResponseData>()
  @Input() total: number
  @Input() currentBonusType: BonusType
  @Input() currentBonusPrice: number
  @Input() currentBonusPercent: number
  @Input() appConfig: AppConfig
  baseTotal: number
  bonusType = BonusType


  constructor(
    private calculateService: CalculateService,
    private _changeDetectionRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.total = this.calculateService.stringToNumber(this.total)
    this.baseTotal = this.total
    this.findBonusPrice()
  }


  findBonusPrice() {
    switch (this.currentBonusType) {
      case BonusType.none:
        this.total = this.baseTotal
        break;
      case BonusType.cart:
        if (this.baseTotal <= 50) {
          this.total = 0
        } else {
          this.total = this.calculateService.minusElements(this.baseTotal, this.currentBonusPrice)
        }
        break;
      case BonusType.percent:
        if (this.currentBonusPercent == 0) {
          this.total = this.baseTotal
        } else {
          var percentValue: number = this.calculateService.percentFind(this.currentBonusPercent, this.baseTotal)
          this.total = this.calculateService.minusElements(this.baseTotal, percentValue)
        }
        break;
    }
  }

  changeBonus(bType: BonusType) {
    this.currentBonusType = bType
    this.findBonusPrice()
  }

  setPerecent(percent: number) {
    this.currentBonusPercent = percent
    this.findBonusPrice()
  }


  confirmBonus() {
    var bonusData: BonusResponseData = {
      bonusType: this.currentBonusType,
      currentBonusPrice: this.currentBonusPrice,
      currentBonusPercent: this.currentBonusPercent
    }
    this.emitChange.emit(bonusData)
  }

  closeExit() {
    this.emitClose.emit()
  }

}
