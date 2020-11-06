import { loadAppConfigLoadeds, appConfigUpdated } from './app-config.actions';
import { AppConfig } from '../../../models/app-config';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const configOfAppFeatureKey = 'configOfApp';

export interface AppConfigState extends EntityState<AppConfig> {
  appConfigLoaded: boolean
}

export const appConfigAdapter = createEntityAdapter<AppConfig>()

export const initialAppConfigState = appConfigAdapter.getInitialState({
  appConfigLoaded: false
})

export const appConfigReducer = createReducer(
  initialAppConfigState,
  on(loadAppConfigLoadeds,
    (state, action) => appConfigAdapter.addOne(
      action.appConfig,
      { ...state, appConfigLoaded: true }
    )),
  on(appConfigUpdated, (state, action) => appConfigAdapter.updateOne(action.update, state))
)


// export const reducers: ActionReducerMap<any> = {

// };


export const metaReducers: MetaReducer<AppConfigState>[] = !environment.production ? [] : [];


export const {
  selectAll,

} = appConfigAdapter.getSelectors();
