import { Update } from '@ngrx/entity';
import { API_URL } from './../../../config';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MenuCategory } from './../../../models/menu-category';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';

@Injectable()
export class MenuCategoryDataService extends DefaultDataService<MenuCategory> {

  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('MenuCategory', http, httpUrlGenerator);
  }

  getAll(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(API_URL + "/api/data/menu/all");
  }

  add(entity: MenuCategory): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(API_URL + "/api/menu-category/add", entity);
  }

  update(entity: Update<MenuCategory>): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(API_URL + "/api/menu-category/update", entity.changes);
  }

}
