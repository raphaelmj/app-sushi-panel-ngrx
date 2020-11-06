import { loadDescOptions } from './../../panel/options-and-config/desc-options-entity/desc-options.actions';
import { tap, first, finalize } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../reducers/index';
import { DescOptionsService } from './desc-options.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DescOptions } from '../../models/desc-options';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DescOptionsResolveService implements Resolve<boolean> {

  loading: boolean = false

  constructor(private descOptionsService: DescOptionsService, private store: Store<AppState>) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store
      .pipe(
        select(state => !!state['descOptionses'].descLoaded),
        tap((loaded) => {
          if (!loaded) {
            this.store.dispatch(loadDescOptions())
            this.loading = true
          }
        }),
        first(),
        finalize(() => this.loading = false)
      )
  }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DescOptions[] | Observable<DescOptions[]> | Promise<DescOptions[]> {
  //   return this.descOptionsService.getAll()
  // }
}
