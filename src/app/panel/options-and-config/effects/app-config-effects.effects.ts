import { AppConfigService } from '../../../services/options-config/app-config.service';
import { concatMap, map } from 'rxjs/operators';
import { loadAppConfigLoadeds, loadAppConfig, appConfigUpdated } from './../app-config-entity/app-config.actions';
import { Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';



@Injectable()
export class AppConfigEffectsEffects {

  @Effect()
  loadAppConfig$ = this.actions$
    .pipe(
      ofType(loadAppConfig),
      concatMap(action => this.appConfigService.getFirst()),
      map(appConfig => loadAppConfigLoadeds({ appConfig }))
    )


  // loadAppConfig$ = createEffect(
  //   () => this.actions$
  //     .pipe(
  //       ofType(loadAppConfig),
  //       concatMap(action => this.appConfigService.getFirst()),
  //       map(appConfig => loadAppConfigLoadeds({ appConfig }))
  //     )
  // )

  saveApp$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(appConfigUpdated),
        concatMap(action => this.appConfigService.update(
          action.update.changes
        ))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private appConfigService: AppConfigService) { }

}
