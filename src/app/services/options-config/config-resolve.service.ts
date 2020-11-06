import { selectAppConfig } from './../../panel/options-and-config/selectors/app-config-selectors.selectors';
import { loadAppConfigLoadeds, loadAppConfig } from './../../panel/options-and-config/app-config-entity/app-config.actions';
import { tap, filter, first, finalize } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../models/app-config';
import { AppState } from 'src/app/reducers';

@Injectable({
  providedIn: 'root'
})
export class ConfigResolveService implements Resolve<AppConfig> {

  loading = false;

  constructor(private appConfigService: AppConfigService, private store: Store<AppState>) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.store
      .pipe(
        select(selectAppConfig),
        tap((loaded) => {
          if (!this.loading && !loaded) {
            this.store.dispatch(loadAppConfig())
            this.loading = true
          }
        }),
        first(),
        finalize(() => this.loading = false)
      )
    // return this.appConfigService.getFirst()
  }
  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AppConfig | Observable<AppConfig> | Promise<AppConfig> {
  //   return this.appConfigService.getFirst()
  // }
}
