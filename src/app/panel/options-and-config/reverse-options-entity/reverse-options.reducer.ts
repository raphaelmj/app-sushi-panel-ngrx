import { ReverseOptions } from './../../../models/reverse-options';
import { compareByOrdering } from './../../../models/compare-by-ordering'
import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as ReverseOptionsActions from './reverse-options.actions';

export const reverseOptionsesFeatureKey = 'reverseOptionses';

export interface ReverseOptionsState extends EntityState<ReverseOptions> {
  reverseLoaded: boolean
}

export const reverseOptionsAdapter: EntityAdapter<ReverseOptions> = createEntityAdapter<ReverseOptions>(
  {
    sortComparer: compareByOrdering
  }
);

export const initialStateReverse: ReverseOptionsState = reverseOptionsAdapter.getInitialState({
  reverseLoaded: false
});


export const reducer = createReducer(
  initialStateReverse,
  on(ReverseOptionsActions.loadReverseOptionsLoadeds,
    (state, action) => reverseOptionsAdapter.setAll(
      action.reverseOptions,
      { ...state, reverseLoaded: true }
    )),
  on(
    ReverseOptionsActions.reverseOptionsUpdated,
    (state, action) => reverseOptionsAdapter.updateOne(action.update, state)
  ),
  on(
    ReverseOptionsActions.revereseOptionsOrderAllUpdate,
    (state, action) => reverseOptionsAdapter.updateMany(action.updates, state)
  ),
  on(
    ReverseOptionsActions.reverseOptionsRemoveOne,
    (state, action) => reverseOptionsAdapter.removeOne(action.key, state)
  ),
  on(
    ReverseOptionsActions.reverseOptionsAddOne,
    (state, action) => reverseOptionsAdapter.addOne(action.entity, state)
  )
);



export const {
  selectAll
} = reverseOptionsAdapter.getSelectors();
