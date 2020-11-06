import { Observable } from 'rxjs';
import { MenuElementService } from './menu-element.service';
import { MenuCategory } from './../../models/menu-category';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { MenuElement } from '../../models/menu-element';

@Injectable({
  providedIn: 'root'
})
export class MenuCategoryFreeResolveService implements Resolve<MenuElement[]> {

  constructor(private menuElementService: MenuElementService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MenuElement[] | Observable<MenuElement[]> | Promise<MenuElement[]> {
    return this.menuElementService.getFreeElements()
  }

}
