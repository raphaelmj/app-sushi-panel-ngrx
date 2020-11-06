import { ReverseOptions } from '../../../models/reverse-options';
import { reverseOptionsesFeatureKey } from './../reverse-options-entity/reverse-options.reducer';
import { concatMap, map } from 'rxjs/operators';
import { ofType } from '@ngrx/effects';
import { ReverseOptionsService } from './../../../services/options-config/reverse-options.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import * as ReverseOptionsActions from '../reverse-options-entity/reverse-options.actions';


@Injectable()
export class ReverseOptionsEffectsEffects {

  loadReverseOptions$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(ReverseOptionsActions.loadReverseOptions),
        concatMap(action => this.reverseOptionsService.getAll()),
        map(rs => ReverseOptionsActions.loadReverseOptionsLoadeds({ reverseOptions: rs }))
      )
  )

  updateOneReverseOptions$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(ReverseOptionsActions.reverseOptionsUpdated),
        concatMap(action => this.reverseOptionsService.updateOption(<ReverseOptions>action.update.changes))
      ),
    { dispatch: false }
  )

  updateAllOrderingReverseOptions$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(ReverseOptionsActions.revereseOptionsOrderAllUpdate),
        concatMap(action => {
          var rs: ReverseOptions[] = action.updates.map((r) => {
            return <ReverseOptions>r.changes
          })
          return this.reverseOptionsService.updateOrder(rs)
        })
      ),
    { dispatch: false }
  )

  removeOneReverseOption$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(ReverseOptionsActions.reverseOptionsRemoveOne),
        concatMap(action => this.reverseOptionsService.delete(action.key))
      ),
    { dispatch: false }
  )

  constructor(private actions$: Actions, private reverseOptionsService: ReverseOptionsService) { }

}
