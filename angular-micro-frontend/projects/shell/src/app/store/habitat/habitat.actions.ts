import { createAction, props } from '@ngrx/store';
import { HabitatPackage, HabitatPackageResponse } from './habitat.models';

export const loadPackages = createAction(
  '[Habitat] Load Packages',
  props<{ page?: number; searchQuery?: string }>()
);

export const loadPackagesSuccess = createAction(
  '[Habitat] Load Packages Success',
  props<{ response: HabitatPackageResponse }>()
);

export const loadPackagesFailure = createAction(
  '[Habitat] Load Packages Failure',
  props<{ error: string }>()
);

export const loadMorePackages = createAction(
  '[Habitat] Load More Packages'
);

export const searchPackages = createAction(
  '[Habitat] Search Packages',
  props<{ query: string }>()
);

export const clearPackages = createAction(
  '[Habitat] Clear Packages'
);
