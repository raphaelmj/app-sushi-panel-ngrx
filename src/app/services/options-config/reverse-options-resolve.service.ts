import { loadReverseOptions } from './../../panel/options-and-config/reverse-options-entity/reverse-options.actions';
import { tap, first, finalize } from 'rxjs/operators';
import { selectReverseOptions } from './../../panel/options-and-config/selectors/reverse-options-selectors.selectors';
import { AppState } from './../../reducers/index';
import { Store, select } from '@ngrx/store';
import { ReverseOptionsService } from './reverse-options.service';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ReverseOptions } from '../../models/reverse-options';
@Injectable({
  providedIn: 'root'
})
export class ReverseOptionsResolveService implements Resolve<boolean> {

  loading: boolean = false

  constructor(private reverseOptionsService: ReverseOptionsService, private store: Store<AppState>) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.store
      .pipe(
        select(selectReverseOptions),
        tap((loaded) => {
          if (!this.loading && !loaded) {
            this.store.dispatch(loadReverseOptions())
            this.loading = true
          }
        }),
        first(),
        finalize(() => this.loading = false)
      )
    // return this.appConfigService.getFirst()
  }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ReverseOptions[] | Observable<ReverseOptions[]> | Promise<ReverseOptions[]> {
  //   return this.reverseOptionsService.getAll()
  // }

}
