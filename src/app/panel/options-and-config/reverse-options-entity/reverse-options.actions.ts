import { ReverseOptions } from './../../../models/reverse-options';
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const loadReverseOptions = createAction(
  "[ReverseOptions Load] Load ReverseOptions"
);

export const loadReverseOptionsLoadeds = createAction(
  '[ReverseOptions Loaded] Load ReverseOptions Loadeds',
  props<{ reverseOptions: ReverseOptions[] }>()
);

export const reverseOptionsUpdated = createAction(
  "[Edit ReverseOptions ReverseOptionsEdit] ReverseOptions Updated",
  props<{ update: Update<ReverseOptions> }>()
);

export const revereseOptionsOrderAllUpdate = createAction(
  "[Edit ReverseOptions ReverseOptionsEdit] ReverseOptions All Updated",
  props<{ updates: Update<ReverseOptions>[] }>()
)


export const reverseOptionsRemoveOne = createAction(
  "[Remove ReverseOptions ReverseOptionsEdit] ReverseOptions Remove",
  props<{ key: number }>()
)

export const reverseOptionsAddOne = createAction(
  "[Add ReverseOptions ReverseOptionsEdit] ReverseOptions Add",
  props<{ entity: ReverseOptions }>()
)
