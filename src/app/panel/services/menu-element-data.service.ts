import { Observable } from 'rxjs';
import { API_URL } from './../../config';
import { HttpClient } from '@angular/common/http';
import { MenuElement } from './../../models/menu-element';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Injectable } from '@angular/core';

@Injectable()
export class MenuElementDataService extends DefaultDataService<MenuElement> {

  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('MenuElement', http, httpUrlGenerator);
  }

  getAll(): Observable<MenuElement[]> {
    return this.http.get<MenuElement[]>(API_URL + '/api/menu-element/all')
  }

  freeElementFromMenuCategory(element: Partial<MenuElement>): Observable<MenuElement> {
    return this.http.post<MenuElement>(API_URL + "/api/menu-element/free/from/menu-category", element)
  }


}
