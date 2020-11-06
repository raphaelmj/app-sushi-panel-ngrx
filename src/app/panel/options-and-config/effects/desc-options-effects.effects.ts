import { DescOptions } from '../../../models/desc-options';
import { loadDescOptionsLoadeds, descOptionsUpdated, descOptionsRemoveOne } from './../desc-options-entity/desc-options.actions';
import { concatMap, map } from 'rxjs/operators';
import { ofType } from '@ngrx/effects';
import { DescOptionsService } from './../../../services/options-config/desc-options.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import * as DescOptionsActions from "../desc-options-entity/desc-options.actions"


@Injectable()
export class DescOptionsEffectsEffects {

  loadDescOptions$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(DescOptionsActions.loadDescOptions),
        concatMap(action => this.descOptionsService.getAll()),
        map(ds => DescOptionsActions.loadDescOptionsLoadeds({ descOptions: ds }))

      )
  )

  updateOneDescOptions$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(DescOptionsActions.descOptionsUpdated),
        concatMap(action => this.descOptionsService.updateOption(<DescOptions>action.update.changes))
      ),
    { dispatch: false }
  )

  updateAllOrderingDescOptions$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(DescOptionsActions.descOptionsOrderAllUpdate),
        concatMap(action => {
          var ds: DescOptions[] = action.updates.map((r) => {
            return <DescOptions>r.changes
          })
          return this.descOptionsService.updateOrder(ds)
        })
      ),
    { dispatch: false }
  )

  removeOneDescOption$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(DescOptionsActions.descOptionsRemoveOne),
        concatMap(action => this.descOptionsService.delete(action.key))
      ),
    { dispatch: false }
  )

  constructor(private actions$: Actions, private descOptionsService: DescOptionsService) { }

}
