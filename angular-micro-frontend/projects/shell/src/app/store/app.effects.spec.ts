import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AppEffects } from './app.effects';
import * as AppActions from './app.actions';

describe('AppEffects', () => {
  let actions$: Observable<any>;
  let effects: AppEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(AppEffects);
  });

  describe('loadMessage$', () => {
    it('should return loadMessageSuccess action on successful load', (done) => {
      const action = AppActions.loadMessage();
      const outcome = AppActions.loadMessageSuccess({
        message: 'Hello from NgRX Effects!'
      });

      actions$ = of(action);

      effects.loadMessage$.subscribe(result => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
