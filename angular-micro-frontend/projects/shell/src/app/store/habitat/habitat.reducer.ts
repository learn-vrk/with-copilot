/**
 * @fileoverview NgRX reducer for managing Chef Habitat package state.
 * 
 * This file defines the reducer function that handles state transitions
 * based on dispatched actions, maintaining immutable state updates.
 * 
 * @author Angular Development Team
 * @since 1.0.0
 */

import { createReducer, on } from '@ngrx/store';
import { HabitatState } from './habitat.models';
import * as HabitatActions from './habitat.actions';

/**
 * Initial state for the Habitat packages feature.
 * 
 * Defines the default values for all state properties when the
 * application starts or when the state is reset.
 */
export const initialState: HabitatState = {
  /** Empty array of packages initially */
  packages: [],
  /** Not loading initially */
  loading: false,
  /** No error initially */
  error: null,
  /** Zero total count initially */
  totalCount: 0,
  /** Start at page 0 */
  currentPage: 0,
  /** Default page size of 50 items */
  pageSize: 50,
  /** Empty search query initially */
  searchQuery: ''
};

/**
 * Reducer function for handling Habitat package state changes.
 * 
 * This reducer handles all actions related to package loading, searching,
 * pagination, and error states. It ensures immutable state updates.
 * 
 * @example
 * // Reducer is registered in the module:
 * StoreModule.forRoot({ habitat: habitatReducer })
 */
export const habitatReducer = createReducer(
  initialState,
  
  /**
   * Handle loadPackages action - sets loading state and updates page/search query.
   */
  on(HabitatActions.loadPackages, (state, { page, searchQuery }) => ({
    ...state,
    loading: true,
    error: null,
    currentPage: page || 0,
    searchQuery: searchQuery || state.searchQuery
  })),
  
  /**
   * Handle loadPackagesSuccess action - adds new packages and updates total count.
   * For page 0, replaces existing packages; for other pages, appends to existing.
   */
  on(HabitatActions.loadPackagesSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    packages: state.currentPage === 0 ? response.data : [...state.packages, ...response.data],
    totalCount: response.total_count,
    error: null
  })),
  
  /**
   * Handle loadPackagesFailure action - sets error message and stops loading.
   */
  on(HabitatActions.loadPackagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  /**
   * Handle loadMorePackages action - increments the current page counter.
   */
  on(HabitatActions.loadMorePackages, (state) => ({
    ...state,
    currentPage: state.currentPage + 1
  })),
  
  /**
   * Handle searchPackages action - sets search query and resets to page 0.
   */
  on(HabitatActions.searchPackages, (state, { query }) => ({
    ...state,
    searchQuery: query,
    currentPage: 0,
    packages: []
  })),
  
  /**
   * Handle clearPackages action - resets all package-related state to initial values.
   */
  on(HabitatActions.clearPackages, (state) => ({
    ...state,
    packages: [],
    currentPage: 0,
    totalCount: 0,
    searchQuery: ''
  }))
);
