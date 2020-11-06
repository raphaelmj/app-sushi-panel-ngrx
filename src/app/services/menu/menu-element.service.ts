import { MenuCategory } from './../../models/menu-category';
import { CartCategory } from './../../models/cart-category';
import { API_URL } from './../../config';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuElement } from 'src/app/models/menu-element';
import { ElementOptionType, ElementMenuType } from 'src/app/models/site';

@Injectable({
  providedIn: 'root'
})
export class MenuElementService {

  constructor(private httpClient: HttpClient) { }

  getFreeElements(): Observable<MenuElement[]> {
    return this.httpClient.get<MenuElement[]>(API_URL + "/api/menu-category/get/free/elements")
  }

  changeElementsOrder(elements: MenuElement[]): Promise<any> {
    return this.httpClient.post(API_URL + "/api/menu-category/elements/order/change", elements).toPromise()
  }

  updateMany(elements: MenuElement[]): Observable<MenuElement[]> {
    return this.httpClient.post<MenuElement[]>(API_URL + "/api/menu-element/update/many", elements)
  }

  changeElementsOrderAdd(elements: MenuElement[], menuCategoryId: number): Observable<MenuElement[]> {
    return this.httpClient.post<MenuElement[]>(API_URL + "/api/menu-category/add/elements/order/change", { elements, menuCategoryId })
  }

  freeElementFromMenuCategory(element: MenuElement): Observable<MenuElement> {
    return this.httpClient.post<MenuElement>(API_URL + "/api/menu-element/free/from/menu-category", element)
  }

  changeField(value: any, field: string, id: number): Promise<any> {
    return this.httpClient.post(API_URL + "/api/menu-element/change/field", { value, field, id }).toPromise()
  }

  addElementToMenu(element: MenuElement, menuCategoryId: number): Observable<MenuElement> {
    return this.httpClient.post<MenuElement>(API_URL + "/api/menu-category/add/element/to/menu", { element, menuCategoryId })
  }

  update(element: MenuElement): Promise<any> {
    return this.httpClient.post(API_URL + "/api/menu-element/update", element).toPromise()
  }

  create(element: MenuElement, cartCategory: CartCategory): Promise<any> {
    return this.httpClient.post(API_URL + "/api/menu-element/create", { element, cartCategory }).toPromise()
  }

  delete(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/menu-element/delete/' + id).toPromise()
  }

  makeEmpty(): MenuElement {
    return {
      optionsOnInit: ElementOptionType.none,
      options: [],
      elastic: false,
      elementType: ElementMenuType.oneName,
      name: '',
      shortName: '',
      hasNamePrefix: false,
      description: '',
      perSizeForAll: '',
      image: '',
      priceNames: [],
      descElements: [],
      configStepsPrice: [],
      skipStepOne: false,
      price: [],
      hasGluten: false,
      onlyGluten: false,
      canGrill: false,
      onlyGrill: false,
      canExtra: false,
      canPack: false,
      canAcc: false,
      canOnePlate: false,
      showOnPlus: false,
    }
  }

}
