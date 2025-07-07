import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as HabitatActions from './habitat.actions';
import { HabitatPackageResponse } from './habitat.models';

@Injectable()
export class HabitatEffects {
  private apiUrl = 'https://bldr.habitat.sh/v1/depot/pkgs/core';

  loadPackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HabitatActions.loadPackages),
      switchMap(({ page, searchQuery }) => {
        const params = new URLSearchParams();
        
        if (page) {
          params.append('range', `${page * 50}-${(page + 1) * 50 - 1}`);
        }
        
        if (searchQuery) {
          params.append('q', searchQuery);
        }
        
        const url = `${this.apiUrl}?${params.toString()}`;
        
        return this.http.get<HabitatPackageResponse>(url).pipe(
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
    private http: HttpClient
  ) {}
}
