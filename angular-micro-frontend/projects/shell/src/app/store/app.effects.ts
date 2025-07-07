import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, delay } from 'rxjs/operators';
import * as AppActions from './app.actions';

@Injectable()
export class AppEffects {
  
  loadMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadMessage),
      switchMap(() =>
        // Simulate API call
        of('Hello from NgRX Effects!').pipe(
          delay(1000),
          map(message => AppActions.loadMessageSuccess({ message })),
          catchError(error => of(AppActions.loadMessageFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions) {}
}
