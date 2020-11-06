import { map, tap, first, filter } from 'rxjs/operators';
import { MenuCategoryEntityService } from './../../panel/list-menu/services/menu-category-entity.service';
import { MenuCategoryService } from './menu-category.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MenuCategory } from '../../models/menu-category';

@Injectable({
  providedIn: 'root'
})
export class MenuCategoryResolveService implements Resolve<boolean> {

  constructor(private menuCategoryService: MenuCategoryService, private menuCategoryEntityService: MenuCategoryEntityService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.menuCategoryEntityService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.menuCategoryEntityService.getAll()
          }
        }),
        filter(loaded => !!loaded),
        first()
      )
  }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MenuCategory[] | Observable<MenuCategory[]> | Promise<MenuCategory[]> {
  //   return this.menuCategoryService.getMenuFull()
  // }
}
