import { descOptionsesFeatureKey, DescOptionsState, selectAll } from './../desc-options-entity/desc-options.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectDescOptionsState =
  createFeatureSelector<DescOptionsState>(descOptionsesFeatureKey);


export const selectDescOptions = createSelector(
  selectDescOptionsState,
  (state) => state.descLoaded
)


export const selectAllDescOptions = createSelector(
  selectDescOptionsState,
  selectAll
);

export const selectDescOptionsList = createSelector(
  selectAllDescOptions,
  (r) => {
    if (r.length > 0) {
      return r
    } else {
      return []
    }

  }
);
