import { AppConfig } from './../../../models/app-config';
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const loadAppConfig = createAction(
  "[AppConfig Load] Load AppConfig"
);

export const loadAppConfigLoadeds = createAction(
  '[AppConfig Loaded] Load AppConfig Loadeds',
  props<{ appConfig: AppConfig }>()
);

export const appConfigUpdated = createAction(
  "[Edit AppConfig AppConfigEdit] AppConfig Updated",
  props<{ update: Update<AppConfig> }>()
);


