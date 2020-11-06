import { BonusType } from './cart-order';
import { ServeType } from './cart-element';
import { ElementType } from './cart-element';
import { EsElementPositionType, EsOptionsElement, EsDescElement, EsReverseElement, Weekdays } from './es-element';

export interface EsOrderNestedElement {
  id: string
  oelId: number
  poelId: number
  melId: number
  cCId: number
  indString: string
  index: number | null
  priceNameIndex: number | null
  configFirstIndex: number | null
  configSecondIndex: number | null
  configThirdIndex: number | null
  name: string
  elementPositionType: EsElementPositionType
  elastic: boolean
  elementType: ElementType
  isSea: boolean
  hasGluten: boolean
  canGrill: boolean
  canPack: boolean
  canAcc: boolean
  canOnePlate: boolean
  canExtra: boolean
  onlyGrill: boolean
  onlyGluten: boolean
  gluten: number
  grill: number
  pricePerOne: number
  quantity: number
  hasPlus: boolean
  serveType: ServeType
  element: string
  description: string
  optionsElements: EsOptionsElement[]
  descElements: EsDescElement[]
  reverseElements: EsReverseElement[]
}

export interface EsOrderDataElement {
  oId: number
  bonusUsed: boolean
  currentBonusPrice: number
  currentBonusPercent: number
  bonusType: BonusType
  oneExtraPrice: number
  endAt: string
  startAt: string
  endDay: string
  weekDay: Weekdays
  total: number
  bonusTotal: number
  extra: number
  extraTotalPrice: number
}

export interface EsOrderIndexElement extends EsOrderDataElement {
  elements: EsOrderNestedElement[]
}
