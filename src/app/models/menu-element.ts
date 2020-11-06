import { CartCategory } from "./cart-category";
import { ElementOptionType, ElementPrice, ElementPriceName, ElementDesc } from "./site";
export enum ElementMenuType {
  manyNames = "many_names",
  oneName = "one_name",
  descElements = "desc_elements",
  configPrice = "config_price",
  configStepsPrice = "config_steps_price",
  configStepsPriceMany = "config_steps_price_many"
}

export interface PriceTypeOption {
  name: string
  shortName: string
  price: string,
  isSea: boolean
}

export interface ElementConfigStepsPriceType {
  type: string,
  options: PriceTypeOption[]
}

export interface ElementConfigStepsPrice {
  name: string
  shortName: string
  types: ElementConfigStepsPriceType[]
}

export interface MenuElement {
  id?: number;
  _id?: string;
  optionsOnInit: ElementOptionType;
  options: string[];
  elastic: boolean;
  elementType: ElementMenuType;
  name: string;
  shortName?: string;
  hasNamePrefix: boolean;
  description: string;
  perSizeForAll: string;
  image: string;
  priceNames: ElementPriceName[];
  descElements: ElementDesc[];
  configStepsPrice: ElementConfigStepsPrice[]
  skipStepOne: boolean
  price: ElementPrice[];
  hasGluten: boolean;
  onlyGluten: boolean;
  canGrill: boolean;
  onlyGrill: boolean;
  canExtra: boolean
  canPack: boolean
  canOnePlate: boolean
  canAcc: boolean
  showOnPlus: boolean
  cartCategory?: CartCategory;
  menuCategoryId?: number
  cartCategoryId?: number,
  ordering?: number
}
