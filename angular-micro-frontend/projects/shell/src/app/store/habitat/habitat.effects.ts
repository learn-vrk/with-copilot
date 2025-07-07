import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as HabitatActions from './habitat.actions';
import { HabitatService } from '../../services/habitat.service';

@Injectable()
export class HabitatEffects {

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

  loadMorePackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HabitatActions.loadMorePackages),
      map(() => HabitatActions.loadPackages({ page: 1 }))
    )
  );

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
