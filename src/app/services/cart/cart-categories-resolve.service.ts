import { CartCategoryService } from './cart-category.service';
import { Observable } from 'rxjs';
import { CartCategory } from './../../models/cart-category';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartCategoriesResolveService implements Resolve<CartCategory[]> {

  constructor(private cartCategoryService: CartCategoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CartCategory[] | Observable<CartCategory[]> | Promise<CartCategory[]> {
    return this.cartCategoryService.getAll()
  }
}
