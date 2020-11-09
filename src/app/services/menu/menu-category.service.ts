import { element } from 'protractor';
import { API_URL } from './../../config';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuCategory } from '../../models/menu-category';

@Injectable({
  providedIn: 'root'
})
export class MenuCategoryService {

  constructor(private httpClient: HttpClient) { }


  getMenuFull(): Observable<MenuCategory[]> {
    return this.httpClient.get<MenuCategory[]>(API_URL + "/api/data/menu/all");
  }


  create(element: MenuCategory): Promise<any> {
    return this.httpClient.post(API_URL + "/api/menu-category/add", element).toPromise()
  }

  update(element: MenuCategory): Promise<any> {
    return this.httpClient.post(API_URL + "/api/menu-category/update", element).toPromise()
  }

  getById(id: number): Observable<MenuCategory> {
    return this.httpClient.get<MenuCategory>(API_URL + "/api/menu-category/" + id);
  }

  changeOrder(elements: MenuCategory[]): Observable<MenuCategory[]> {
    return this.httpClient.post<MenuCategory[]>(API_URL + "/api/menu-category/order/change", elements)
  }

  updateMany(elements: MenuCategory[]): Observable<MenuCategory[]> {
    return this.httpClient.post<MenuCategory[]>(API_URL + "/api/menu-category/update/many", elements)
  }

  delete(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + "/api/menu-category/delete/" + id).toPromise()
  }

  createEmpty(): MenuCategory {
    return {
      name: "",
      fullName: "",
      bgColor: "#000000",
      fontColor: "#FFFFFF"
    }
  }


}
