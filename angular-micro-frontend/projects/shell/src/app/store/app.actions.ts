import { createAction, props } from '@ngrx/store';

export const updateMessage = createAction(
  '[App] Update Message',
  props<{ message: string }>()
);

export const loadMessage = createAction(
  '[App] Load Message'
);

export const loadMessageSuccess = createAction(
  '[App] Load Message Success',
  props<{ message: string }>()
);

export const loadMessageFailure = createAction(
  '[App] Load Message Failure',
  props<{ error: string }>()
);
