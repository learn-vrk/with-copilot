/**
 * @fileoverview NgRX selectors for accessing Chef Habitat package state.
 * 
 * This file defines memoized selectors that efficiently extract specific
 * pieces of state from the NgRX store for use in components and effects.
 * 
 * @author Angular Development Team
 * @since 1.0.0
 */

import { createSelector, createFeatureSelector } from '@ngrx/store';
import { HabitatState } from './habitat.models';

/**
 * Feature selector for the entire Habitat state slice.
 * 
 * @example
 * this.store.select(selectHabitatState).subscribe(state => console.log(state));
 */
export const selectHabitatState = createFeatureSelector<HabitatState>('habitat');

/**
 * Selector for the array of loaded packages.
 * 
 * @example
 * this.packages$ = this.store.select(selectPackages);
 */
export const selectPackages = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.packages
);

/**
 * Selector for the loading state indicator.
 * 
 * @example
 * this.loading$ = this.store.select(selectLoading);
 */
export const selectLoading = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.loading
);

/**
 * Selector for any error messages.
 * 
 * @example
 * this.error$ = this.store.select(selectError);
 */
export const selectError = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.error
);

/**
 * Selector for the total count of packages available on the server.
 * 
 * @example
 * this.totalCount$ = this.store.select(selectTotalCount);
 */
export const selectTotalCount = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.totalCount
);

/**
 * Selector for the current page index.
 * 
 * @example
 * this.currentPage$ = this.store.select(selectCurrentPage);
 */
export const selectCurrentPage = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.currentPage
);

/**
 * Selector for the current search query string.
 * 
 * @example
 * this.searchQuery$ = this.store.select(selectSearchQuery);
 */
export const selectSearchQuery = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.searchQuery
);

/**
 * Computed selector that determines if more packages are available for loading.
 * Returns true if the number of loaded packages is less than the total count.
 * 
 * @example
 * this.hasMorePackages$ = this.store.select(selectHasMorePackages);
 */
export const selectHasMorePackages = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.packages.length < state.totalCount
);
