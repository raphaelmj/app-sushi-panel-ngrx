import { element } from 'protractor';
import { MenuElement } from 'src/app/models/menu-element';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartCategory } from '../../models/cart-category';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartCategoryService {

  constructor(private httpClient: HttpClient) { }


  getAll(): Observable<CartCategory[]> {
    return this.httpClient.get<CartCategory[]>(environment.apiUrl + '/api/cart-category/get/full/list');
  }

  updateCartElements(elements: MenuElement[], cartCategoryId: number): Promise<any> {
    return this.httpClient.post(environment.apiUrl + "/api/cart-category/set/cart/elements", { elements, cartCategoryId }).toPromise()
  }

  changeField(value: any, field: string, id: number): Promise<any> {
    return this.httpClient.post(environment.apiUrl + "/api/cart-category/change/field", { value, field, id }).toPromise()
  }

  updateCartCategory(cartCategory: CartCategory): Promise<any> {
    return this.httpClient.post(environment.apiUrl + "/api/cart-category/update", cartCategory).toPromise()
  }

  getById(id: number): Observable<CartCategory> {
    return this.httpClient.get<CartCategory>(environment.apiUrl + "/api/cart-category/" + id);
  }

}
