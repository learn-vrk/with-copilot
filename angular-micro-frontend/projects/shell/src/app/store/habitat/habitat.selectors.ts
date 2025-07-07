import { createSelector, createFeatureSelector } from '@ngrx/store';
import { HabitatState } from './habitat.models';

export const selectHabitatState = createFeatureSelector<HabitatState>('habitat');

export const selectPackages = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.packages
);

export const selectLoading = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.loading
);

export const selectError = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.error
);

export const selectTotalCount = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.totalCount
);

export const selectCurrentPage = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.currentPage
);

export const selectSearchQuery = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.searchQuery
);

export const selectHasMorePackages = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.packages.length < state.totalCount
);
