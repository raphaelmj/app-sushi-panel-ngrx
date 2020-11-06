import { DescOptions } from './../../../models/desc-options';
import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as DescOptionsActions from './desc-options.actions';
import { compareByOrdering } from './../../../models/compare-by-ordering';
import * as DescActions from "./desc-options.actions"

export const descOptionsesFeatureKey = 'descOptionses';

export interface DescOptionsState extends EntityState<DescOptions> {
  descLoaded: boolean
}

export const descOptionsAdapter: EntityAdapter<DescOptions> = createEntityAdapter<DescOptions>(
  {
    sortComparer: compareByOrdering
  }
);

export const initialStateDesc: DescOptionsState = descOptionsAdapter.getInitialState({
  descLoaded: false
});


export const reducer = createReducer(
  initialStateDesc,
  on(DescActions.loadDescOptionsLoadeds, (state, action) => descOptionsAdapter.setAll(
    action.descOptions,
    { ...state, descLoaded: true }
  )),
  on(
    DescActions.descOptionsUpdated,
    (state, action) => descOptionsAdapter.updateOne(action.update, state)
  ),
  on(
    DescActions.descOptionsOrderAllUpdate,
    (state, action) => descOptionsAdapter.updateMany(
      action.updates,
      state
    )),
  on(
    DescActions.descOptionsRemoveOne,
    (state, action) => descOptionsAdapter.removeOne(action.key, state)
  ),
  on(
    DescActions.descOptionsAddOne,
    (state, action) => descOptionsAdapter.addOne(action.entity, state)
  )
);


export const {
  selectAll
} = descOptionsAdapter.getSelectors();
