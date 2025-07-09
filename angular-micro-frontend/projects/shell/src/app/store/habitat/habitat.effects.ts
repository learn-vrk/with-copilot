/**
 * @fileoverview NgRX effects for handling Chef Habitat package side effects.
 * 
 * This file defines effects that handle asynchronous operations like
 * API calls, transforming actions into other actions, and managing
 * the flow of data through the application.
 * 
 * @author Angular Development Team
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as HabitatActions from './habitat.actions';
import { HabitatService } from '../../services/habitat.service';

/**
 * Effects class for handling Habitat package operations.
 * 
 * Effects listen for specific actions and perform side effects like API calls,
 * then dispatch new actions based on the results.
 * 
 * @example
 * // Effects are automatically registered in the module
 * EffectsModule.forRoot([HabitatEffects])
 */
@Injectable()
export class HabitatEffects {

  /**
   * Effect that handles loading packages from the API.
   * 
   * Listens for: loadPackages action
   * Dispatches: loadPackagesSuccess or loadPackagesFailure
   * 
   * @example
   * // When this action is dispatched:
   * this.store.dispatch(loadPackages({ page: 0, searchQuery: 'nginx' }));
   * // This effect will call the API and dispatch success/failure actions
   */
  loadPackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HabitatActions.loadPackages),
      switchMap(({ page, searchQuery }) => {
        return this.habitatService.getPackages(page, searchQuery).pipe(
          map(response => HabitatActions.loadPackagesSuccess({ response })),
          catchError(error => of(HabitatActions.loadPackagesFailure({ 
            error: error.message || 'Failed to load packages' 
          })))
        );
      })
    )
  );

  /**
   * Effect that handles loading more packages for pagination.
   * 
   * Listens for: loadMorePackages action
   * Dispatches: loadPackages action with next page
   * 
   * @example
   * // When this action is dispatched:
   * this.store.dispatch(loadMorePackages());
   * // This effect will dispatch loadPackages with the next page
   */
  loadMorePackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HabitatActions.loadMorePackages),
      map(() => HabitatActions.loadPackages({ page: 1 }))
    )
  );

  /**
   * Effect that handles package search operations.
   * 
   * Listens for: searchPackages action
   * Dispatches: loadPackages action with search query
   * 
   * @example
   * // When this action is dispatched:
   * this.store.dispatch(searchPackages({ query: 'nginx' }));
   * // This effect will dispatch loadPackages with the search query
   */
  searchPackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HabitatActions.searchPackages),
      map(({ query }) => HabitatActions.loadPackages({ page: 0, searchQuery: query }))
    )
  );

  constructor(
    private actions$: Actions,
    private habitatService: HabitatService
  ) {}
}
