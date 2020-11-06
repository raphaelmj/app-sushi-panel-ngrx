import { DescOptions } from './../../../models/desc-options';
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const loadDescOptions = createAction(
  "[DescOptions Load] Load DescOptions"
);

export const loadDescOptionsLoadeds = createAction(
  '[DescOptions Loaded] Load DescOptions Loadeds',
  props<{ descOptions: DescOptions[] }>()
);

export const descOptionsUpdated = createAction(
  "[Edit DescOptions DescOptionsEdit] DescOptions Updated",
  props<{ update: Update<DescOptions> }>()
);

export const descOptionsOrderAllUpdate = createAction(
  "[Edit DescOptions DescOptionsEdit] DescOptions All Updated",
  props<{ updates: Update<DescOptions>[] }>()
)

export const descOptionsRemoveOne = createAction(
  "[Remove DescOptions DescOptionsEdit] DescOptions Remove",
  props<{ key: number }>()
)

export const descOptionsAddOne = createAction(
  "[Add DescOptions DescOptionsEdit] DescOptions Add",
  props<{ entity: DescOptions }>()
)
