import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from './app.reducer';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectMessage = createSelector(
  selectAppState,
  (state: AppState) => state.message
);

export const selectLoading = createSelector(
  selectAppState,
  (state: AppState) => state.loading
);

export const selectError = createSelector(
  selectAppState,
  (state: AppState) => state.error
);
