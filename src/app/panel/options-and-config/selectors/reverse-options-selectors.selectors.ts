import { reverseOptionsesFeatureKey } from '../reverse-options-entity/reverse-options.reducer';
import { ReverseOptionsState, selectAll } from '../reverse-options-entity/reverse-options.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectReverseOptionsState =
  createFeatureSelector<ReverseOptionsState>(reverseOptionsesFeatureKey);


export const selectReverseOptions = createSelector(
  selectReverseOptionsState,
  (state) => state.reverseLoaded
)


export const selectAllReverseOptions = createSelector(
  selectReverseOptionsState,
  selectAll
);

export const selectReverseOptionsList = createSelector(
  selectAllReverseOptions,
  (r) => {
    if (r.length > 0) {
      return r
    } else {
      return []
    }

  }
);
