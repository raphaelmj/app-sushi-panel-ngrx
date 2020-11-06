import { AppConfigState, configOfAppFeatureKey, selectAll } from '../app-config-entity/app-config.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectAppConfigState =
  createFeatureSelector<AppConfigState>(configOfAppFeatureKey);


export const selectAppConfig = createSelector(
  selectAppConfigState,
  (state) => state.appConfigLoaded
)


export const selectAllAppConfig = createSelector(
  selectAppConfigState,
  selectAll
);

export const selectFirstAppConfig = createSelector(
  selectAllAppConfig,
  (appConfigs) => {
    if (appConfigs.length > 0) {
      return appConfigs[0]
    } else {
      return undefined
    }

  }
);
