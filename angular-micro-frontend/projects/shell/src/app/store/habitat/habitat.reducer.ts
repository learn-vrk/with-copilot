import { createReducer, on } from '@ngrx/store';
import { HabitatState } from './habitat.models';
import * as HabitatActions from './habitat.actions';

export const initialState: HabitatState = {
  packages: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 0,
  pageSize: 50,
  searchQuery: ''
};

export const habitatReducer = createReducer(
  initialState,
  on(HabitatActions.loadPackages, (state, { page, searchQuery }) => ({
    ...state,
    loading: true,
    error: null,
    currentPage: page || 0,
    searchQuery: searchQuery || state.searchQuery
  })),
  on(HabitatActions.loadPackagesSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    packages: state.currentPage === 0 ? response.data : [...state.packages, ...response.data],
    totalCount: response.total_count,
    error: null
  })),
  on(HabitatActions.loadPackagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(HabitatActions.loadMorePackages, (state) => ({
    ...state,
    currentPage: state.currentPage + 1
  })),
  on(HabitatActions.searchPackages, (state, { query }) => ({
    ...state,
    searchQuery: query,
    currentPage: 0,
    packages: []
  })),
  on(HabitatActions.clearPackages, (state) => ({
    ...state,
    packages: [],
    currentPage: 0,
    totalCount: 0,
    searchQuery: ''
  }))
);
