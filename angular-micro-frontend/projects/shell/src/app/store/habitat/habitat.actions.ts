/**
 * @fileoverview NgRX actions for managing Chef Habitat package operations.
 * 
 * This file defines all the actions that can be dispatched to modify
 * the Habitat packages state, including loading, searching, and error handling.
 * 
 * @author Angular Development Team
 * @since 1.0.0
 */

import { createAction, props } from '@ngrx/store';
import { HabitatPackage, HabitatPackageResponse } from './habitat.models';

/**
 * Action to initiate loading of Habitat packages.
 * 
 * @example
 * this.store.dispatch(loadPackages({ page: 0, searchQuery: 'nginx' }));
 */
export const loadPackages = createAction(
  '[Habitat] Load Packages',
  props<{ page?: number; searchQuery?: string }>()
);

/**
 * Action dispatched when packages are successfully loaded from the API.
 * 
 * @example
 * // This action is typically dispatched from effects
 * this.store.dispatch(loadPackagesSuccess({ response: apiResponse }));
 */
export const loadPackagesSuccess = createAction(
  '[Habitat] Load Packages Success',
  props<{ response: HabitatPackageResponse }>()
);

/**
 * Action dispatched when package loading fails.
 * 
 * @example
 * this.store.dispatch(loadPackagesFailure({ error: 'Network error' }));
 */
export const loadPackagesFailure = createAction(
  '[Habitat] Load Packages Failure',
  props<{ error: string }>()
);

/**
 * Action to load additional packages for pagination.
 * 
 * @example
 * this.store.dispatch(loadMorePackages());
 */
export const loadMorePackages = createAction(
  '[Habitat] Load More Packages'
);

/**
 * Action to search for packages by query string.
 * 
 * @example
 * this.store.dispatch(searchPackages({ query: 'nginx' }));
 */
export const searchPackages = createAction(
  '[Habitat] Search Packages',
  props<{ query: string }>()
);

/**
 * Action to clear all currently loaded packages.
 * 
 * @example
 * this.store.dispatch(clearPackages());
 */
export const clearPackages = createAction(
  '[Habitat] Clear Packages'
);
