import { map, tap, first, filter } from 'rxjs/operators';
import { MenuElementEntityService } from './menu-element-entity.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MenuElementsResolveService implements Resolve<boolean> {

  constructor(private menuElementEntityService: MenuElementEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.menuElementEntityService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.menuElementEntityService.getAll()
          }
        }),
        filter(loaded => !!loaded),
        first()
      )
  }
}
