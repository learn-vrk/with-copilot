import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { HabitatEffects } from './habitat.effects';
import { HabitatService } from '../../services/habitat.service';
import * as HabitatActions from './habitat.actions';
import { HabitatPackageResponse } from './habitat.models';

describe('HabitatEffects', () => {
  let actions$: Observable<any>;
  let effects: HabitatEffects;
  let habitatService: jasmine.SpyObj<HabitatService>;

  const mockResponse: HabitatPackageResponse = {
    data: [
      {
        origin: 'core',
        name: 'nginx',
        version: '1.21.6',
        release: '20240301120000',
        channels: ['stable'],
        platforms: ['x86_64-linux']
      }
    ],
    range_start: 0,
    range_end: 0,
    total_count: 1
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HabitatService', ['getPackages']);

    TestBed.configureTestingModule({
      providers: [
        HabitatEffects,
        provideMockActions(() => actions$),
        { provide: HabitatService, useValue: spy }
      ]
    });

    effects = TestBed.inject(HabitatEffects);
    habitatService = TestBed.inject(HabitatService) as jasmine.SpyObj<HabitatService>;
  });

  describe('loadPackages$', () => {
    it('should return loadPackagesSuccess action on successful load', (done) => {
      const action = HabitatActions.loadPackages({ page: 0 });
      const outcome = HabitatActions.loadPackagesSuccess({ response: mockResponse });

      habitatService.getPackages.and.returnValue(of(mockResponse));
      actions$ = of(action);

      effects.loadPackages$.subscribe(result => {
        expect(result).toEqual(outcome);
        expect(habitatService.getPackages).toHaveBeenCalledWith(0, undefined);
        done();
      });
    });

    it('should return loadPackagesFailure action on error', (done) => {
      const action = HabitatActions.loadPackages({ page: 0 });
      const error = new Error('Network error');
      const outcome = HabitatActions.loadPackagesFailure({ 
        error: 'Network error' 
      });

      habitatService.getPackages.and.returnValue(throwError(() => error));
      actions$ = of(action);

      effects.loadPackages$.subscribe(result => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should call service with correct parameters', (done) => {
      const page = 2;
      const searchQuery = 'nginx';
      const action = HabitatActions.loadPackages({ page, searchQuery });

      habitatService.getPackages.and.returnValue(of(mockResponse));
      actions$ = of(action);

      effects.loadPackages$.subscribe(() => {
        expect(habitatService.getPackages).toHaveBeenCalledWith(page, searchQuery);
        done();
      });
    });

    it('should handle error without message', (done) => {
      const action = HabitatActions.loadPackages({ page: 0 });
      const outcome = HabitatActions.loadPackagesFailure({ 
        error: 'Failed to load packages' 
      });

      habitatService.getPackages.and.returnValue(throwError(() => ({})));
      actions$ = of(action);

      effects.loadPackages$.subscribe(result => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe('loadMorePackages$', () => {
    it('should return loadPackages action with page 1', (done) => {
      const action = HabitatActions.loadMorePackages();
      const outcome = HabitatActions.loadPackages({ page: 1 });

      actions$ = of(action);

      effects.loadMorePackages$.subscribe(result => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe('searchPackages$', () => {
    it('should return loadPackages action with query and page 0', (done) => {
      const query = 'nginx';
      const action = HabitatActions.searchPackages({ query });
      const outcome = HabitatActions.loadPackages({ page: 0, searchQuery: query });

      actions$ = of(action);

      effects.searchPackages$.subscribe(result => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should handle empty query', (done) => {
      const query = '';
      const action = HabitatActions.searchPackages({ query });
      const outcome = HabitatActions.loadPackages({ page: 0, searchQuery: query });

      actions$ = of(action);

      effects.searchPackages$.subscribe(result => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
