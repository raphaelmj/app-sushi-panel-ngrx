import { element } from 'protractor';
import { MenuElement } from 'src/app/models/menu-element';
import { API_URL } from 'src/app/config';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartCategory } from '../../models/cart-category';

@Injectable({
  providedIn: 'root'
})
export class CartCategoryService {

  constructor(private httpClient: HttpClient) { }


  getAll(): Observable<CartCategory[]> {
    return this.httpClient.get<CartCategory[]>(API_URL + '/api/cart-category/get/full/list');
  }

  updateCartElements(elements: MenuElement[], cartCategoryId: number): Promise<any> {
    return this.httpClient.post(API_URL + "/api/cart-category/set/cart/elements", { elements, cartCategoryId }).toPromise()
  }

  changeField(value: any, field: string, id: number): Promise<any> {
    return this.httpClient.post(API_URL + "/api/cart-category/change/field", { value, field, id }).toPromise()
  }

  updateCartCategory(cartCategory: CartCategory): Promise<any> {
    return this.httpClient.post(API_URL + "/api/cart-category/update", cartCategory).toPromise()
  }

  getById(id: number): Observable<CartCategory> {
    return this.httpClient.get<CartCategory>(API_URL + "/api/cart-category/" + id);
  }

}
