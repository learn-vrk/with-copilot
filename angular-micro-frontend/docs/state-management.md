# State Management Architecture

## Overview

This document details the NgRX state management implementation for the Chef Habitat Package Explorer. It covers the complete state architecture, including actions, reducers, effects, selectors, and best practices.

## State Architecture Overview

### Store Structure

```typescript
interface AppState {
  app: AppState;
  habitat: HabitatState;
}

interface AppState {
  message: string;
  loading: boolean;
  error: string | null;
}

interface HabitatState {
  packages: HabitatPackage[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}
```

### State Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Component     │───▶│     Action      │───▶│     Effect      │
│                 │    │                 │    │                 │
│  - Dispatch     │    │  - Type         │    │  - Side Effects │
│  - Subscribe    │    │  - Payload      │    │  - API Calls    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                                              │
         │                                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Selector     │◀───│    Reducer      │◀───│    Service      │
│                 │    │                 │    │                 │
│  - Memoization  │    │  - Pure Func    │    │  - HTTP Client  │
│  - Derivation   │    │  - Immutable    │    │  - Mock Data    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Actions

### Action Categories

#### Habitat Package Actions

```typescript
// Loading Actions
export const loadPackages = createAction(
  '[Habitat] Load Packages',
  props<{ page?: number; searchQuery?: string }>()
);

export const loadMorePackages = createAction(
  '[Habitat] Load More Packages'
);

// Success Actions
export const loadPackagesSuccess = createAction(
  '[Habitat] Load Packages Success',
  props<{ response: HabitatPackageResponse }>()
);

// Failure Actions
export const loadPackagesFailure = createAction(
  '[Habitat] Load Packages Failure',
  props<{ error: string }>()
);

// Search Actions
export const searchPackages = createAction(
  '[Habitat] Search Packages',
  props<{ query: string }>()
);

// Utility Actions
export const clearPackages = createAction(
  '[Habitat] Clear Packages'
);
```

#### App Actions

```typescript
export const loadMessage = createAction('[App] Load Message');

export const loadMessageSuccess = createAction(
  '[App] Load Message Success',
  props<{ message: string }>()
);

export const loadMessageFailure = createAction(
  '[App] Load Message Failure',
  props<{ error: string }>()
);

export const updateMessage = createAction(
  '[App] Update Message',
  props<{ message: string }>()
);
```

### Action Naming Conventions

1. **Bracket Notation**: `[Feature] Action Description`
2. **Verb-Based**: Actions describe what happened
3. **Consistent Patterns**: Load, Success, Failure pattern
4. **Descriptive**: Clear intent and purpose

### Action Best Practices

```typescript
// ✅ Good: Descriptive and specific
export const loadPackagesByChannel = createAction(
  '[Habitat] Load Packages By Channel',
  props<{ channel: string; page: number }>()
);

// ❌ Bad: Vague and non-specific
export const load = createAction('[Habitat] Load');

// ✅ Good: Immutable payload
export const updatePackageFilter = createAction(
  '[Habitat] Update Package Filter',
  props<{ filter: Readonly<PackageFilter> }>()
);
```

## Reducers

### Habitat Reducer

```typescript
export const habitatReducer = createReducer(
  initialState,
  
  // Load packages - set loading state
  on(HabitatActions.loadPackages, (state, { page, searchQuery }) => ({
    ...state,
    loading: true,
    error: null,
    currentPage: page || 0,
    searchQuery: searchQuery || state.searchQuery
  })),
  
  // Load success - update packages and metadata
  on(HabitatActions.loadPackagesSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    packages: state.currentPage === 0 
      ? response.data 
      : [...state.packages, ...response.data],
    totalCount: response.total_count,
    error: null
  })),
  
  // Load failure - set error state
  on(HabitatActions.loadPackagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Search packages - reset to first page
  on(HabitatActions.searchPackages, (state, { query }) => ({
    ...state,
    searchQuery: query,
    currentPage: 0,
    packages: []
  })),
  
  // Clear packages - reset state
  on(HabitatActions.clearPackages, (state) => ({
    ...state,
    packages: [],
    currentPage: 0,
    totalCount: 0,
    searchQuery: ''
  }))
);
```

### Reducer Best Practices

#### Immutability
```typescript
// ✅ Good: Spread operator for immutability
on(updatePackage, (state, { packageUpdate }) => ({
  ...state,
  packages: state.packages.map(pkg =>
    pkg.id === packageUpdate.id ? { ...pkg, ...packageUpdate } : pkg
  )
}))

// ❌ Bad: Direct mutation
on(updatePackage, (state, { packageUpdate }) => {
  state.packages.find(pkg => pkg.id === packageUpdate.id).name = packageUpdate.name;
  return state;
})
```

#### Complex State Updates
```typescript
// ✅ Good: Helper functions for complex logic
const updatePackageInList = (packages: HabitatPackage[], update: Partial<HabitatPackage>) =>
  packages.map(pkg => pkg.id === update.id ? { ...pkg, ...update } : pkg);

on(updatePackage, (state, { packageUpdate }) => ({
  ...state,
  packages: updatePackageInList(state.packages, packageUpdate)
}))
```

## Effects

### Habitat Effects

```typescript
@Injectable()
export class HabitatEffects {

  // Load packages effect
  loadPackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HabitatActions.loadPackages),
      switchMap(({ page, searchQuery }) =>
        this.habitatService.getPackages(page, searchQuery).pipe(
          map(response => HabitatActions.loadPackagesSuccess({ response })),
          catchError(error => of(HabitatActions.loadPackagesFailure({ 
            error: error.message || 'Failed to load packages' 
          })))
        )
      )
    )
  );

  // Load more packages effect
  loadMorePackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HabitatActions.loadMorePackages),
      withLatestFrom(this.store.select(HabitatSelectors.selectCurrentPage)),
      map(([action, currentPage]) => 
        HabitatActions.loadPackages({ page: currentPage + 1 })
      )
    )
  );

  // Search packages effect
  searchPackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HabitatActions.searchPackages),
      map(({ query }) => HabitatActions.loadPackages({ page: 0, searchQuery: query }))
    )
  );

  constructor(
    private actions$: Actions,
    private habitatService: HabitatService,
    private store: Store
  ) {}
}
```

### Effect Patterns

#### Error Handling
```typescript
// ✅ Good: Comprehensive error handling
loadPackages$ = createEffect(() =>
  this.actions$.pipe(
    ofType(HabitatActions.loadPackages),
    switchMap(({ page, searchQuery }) =>
      this.habitatService.getPackages(page, searchQuery).pipe(
        map(response => HabitatActions.loadPackagesSuccess({ response })),
        catchError(error => {
          console.error('Package loading failed:', error);
          return of(HabitatActions.loadPackagesFailure({ 
            error: this.getErrorMessage(error)
          }));
        })
      )
    )
  )
);

private getErrorMessage(error: any): string {
  if (error.error?.message) return error.error.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
}
```

#### Operator Selection
```typescript
// ✅ Good: switchMap cancels previous requests
searchPackages$ = createEffect(() =>
  this.actions$.pipe(
    ofType(HabitatActions.searchPackages),
    switchMap(({ query }) => 
      this.habitatService.searchPackages(query)
    )
  )
);

// ✅ Good: concatMap preserves order
savePackageOrder$ = createEffect(() =>
  this.actions$.pipe(
    ofType(HabitatActions.savePackage),
    concatMap(({ package }) => 
      this.habitatService.savePackage(package)
    )
  )
);

// ✅ Good: mergeMap for parallel execution
loadMultiplePackages$ = createEffect(() =>
  this.actions$.pipe(
    ofType(HabitatActions.loadMultiplePackages),
    mergeMap(({ packageIds }) => 
      packageIds.map(id => this.habitatService.getPackage(id))
    )
  )
);
```

## Selectors

### Feature Selectors

```typescript
// Feature state selector
export const selectHabitatState = createFeatureSelector<HabitatState>('habitat');
export const selectAppState = createFeatureSelector<AppState>('app');
```

### Basic Selectors

```typescript
// Simple property selectors
export const selectPackages = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.packages
);

export const selectLoading = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.loading
);

export const selectError = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.error
);

export const selectTotalCount = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.totalCount
);

export const selectCurrentPage = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.currentPage
);

export const selectSearchQuery = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.searchQuery
);
```

### Computed Selectors

```typescript
// Derived state selectors
export const selectHasMorePackages = createSelector(
  selectHabitatState,
  (state: HabitatState) => state.packages.length < state.totalCount
);

export const selectPackagesByChannel = createSelector(
  selectPackages,
  (packages: HabitatPackage[], props: { channel: string }) =>
    packages.filter(pkg => pkg.channels.includes(props.channel))
);

export const selectSearchResults = createSelector(
  selectPackages,
  selectSearchQuery,
  (packages: HabitatPackage[], query: string) => {
    if (!query.trim()) return packages;
    
    const searchTerm = query.toLowerCase();
    return packages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchTerm) ||
      pkg.origin.toLowerCase().includes(searchTerm)
    );
  }
);

export const selectGridData = createSelector(
  selectPackages,
  selectTotalCount,
  (packages: HabitatPackage[], totalCount: number): GridDataResult => ({
    data: packages || [],
    total: totalCount || 0
  })
);
```

### Selector Performance

#### Memoization
```typescript
// ✅ Good: Proper memoization
export const selectExpensiveComputation = createSelector(
  selectPackages,
  (packages: HabitatPackage[]) => {
    // Expensive computation only runs when packages change
    return packages.reduce((acc, pkg) => {
      // Complex calculation
      return acc + someExpensiveCalculation(pkg);
    }, 0);
  }
);
```

#### Props Selectors
```typescript
// ✅ Good: Props-based selectors
export const selectPackageById = createSelector(
  selectPackages,
  (packages: HabitatPackage[], props: { id: string }) =>
    packages.find(pkg => pkg.id === props.id)
);

// Usage in component
this.package$ = this.store.select(selectPackageById, { id: this.packageId });
```

## Store Configuration

### Module Setup

```typescript
@NgModule({
  imports: [
    StoreModule.forRoot({ 
      app: appReducer,
      habitat: habitatReducer 
    }),
    EffectsModule.forRoot([AppEffects, HabitatEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
      features: {
        pause: false,
        lock: true,
        persist: true
      }
    })
  ]
})
export class AppModule {}
```

### Development Tools

#### Redux DevTools Configuration
```typescript
StoreDevtoolsModule.instrument({
  name: 'Habitat Package Explorer',
  maxAge: 25,
  logOnly: environment.production,
  autoPause: true,
  actionSanitizer: (action) => ({
    ...action,
    // Sanitize sensitive data if needed
  }),
  stateSanitizer: (state) => ({
    ...state,
    // Sanitize sensitive state if needed
  })
})
```

## Testing State Management

### Reducer Testing

```typescript
describe('habitatReducer', () => {
  const initialState: HabitatState = {
    packages: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 0,
    pageSize: 10,
    searchQuery: ''
  };

  it('should set loading to true on loadPackages', () => {
    const action = HabitatActions.loadPackages({ page: 0 });
    const state = habitatReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should update packages on loadPackagesSuccess', () => {
    const mockResponse: HabitatPackageResponse = {
      range_start: 0,
      range_end: 1,
      total_count: 2,
      data: [mockPackage1, mockPackage2]
    };

    const action = HabitatActions.loadPackagesSuccess({ response: mockResponse });
    const state = habitatReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.packages).toEqual(mockResponse.data);
    expect(state.totalCount).toBe(mockResponse.total_count);
  });
});
```

### Selector Testing

```typescript
describe('Habitat Selectors', () => {
  const mockState: AppState = {
    habitat: {
      packages: [mockPackage1, mockPackage2],
      loading: false,
      error: null,
      totalCount: 2,
      currentPage: 0,
      pageSize: 10,
      searchQuery: 'nginx'
    }
  };

  it('should select packages', () => {
    const result = selectPackages.projector(mockState.habitat);
    expect(result).toEqual(mockState.habitat.packages);
  });

  it('should calculate hasMorePackages correctly', () => {
    const result = selectHasMorePackages.projector(mockState.habitat);
    expect(result).toBe(false); // 2 packages, total 2
  });
});
```

### Effect Testing

```typescript
describe('HabitatEffects', () => {
  let actions$: Observable<Action>;
  let effects: HabitatEffects;
  let service: jasmine.SpyObj<HabitatService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('HabitatService', ['getPackages']);

    TestBed.configureTestingModule({
      providers: [
        HabitatEffects,
        provideMockActions(() => actions$),
        { provide: HabitatService, useValue: serviceSpy }
      ]
    });

    effects = TestBed.inject(HabitatEffects);
    service = TestBed.inject(HabitatService) as jasmine.SpyObj<HabitatService>;
  });

  it('should return loadPackagesSuccess on successful load', () => {
    const mockResponse: HabitatPackageResponse = { /* mock data */ };
    const action = HabitatActions.loadPackages({ page: 0 });
    const outcome = HabitatActions.loadPackagesSuccess({ response: mockResponse });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: mockResponse });
    service.getPackages.and.returnValue(response);

    const expected = cold('--b', { b: outcome });
    expect(effects.loadPackages$).toBeObservable(expected);
  });
});
```

## Best Practices

### State Design Principles

1. **Normalize State**: Avoid nested objects and arrays
2. **Single Source of Truth**: Don't duplicate data
3. **Minimal State**: Store only what's necessary
4. **Immutable Updates**: Always create new objects

### Action Guidelines

1. **Descriptive Names**: Actions should be self-documenting
2. **Consistent Patterns**: Follow established naming conventions
3. **Minimal Payloads**: Include only necessary data
4. **Type Safety**: Use TypeScript interfaces for payloads

### Effect Best Practices

1. **Error Handling**: Always handle errors gracefully
2. **Operator Selection**: Choose appropriate RxJS operators
3. **Side Effect Isolation**: Keep effects pure and testable
4. **Resource Management**: Properly manage subscriptions

### Selector Optimization

1. **Memoization**: Leverage NgRX selector memoization
2. **Composition**: Build complex selectors from simple ones
3. **Props Usage**: Use props for parameterized selectors
4. **Performance**: Avoid expensive computations in selectors

## Future Enhancements

### Planned Improvements

1. **Entity State**: Use NgRX Entity for normalized state
2. **Router State**: Integrate with NgRX Router Store
3. **Persistence**: Add state persistence with local storage
4. **Real-time Updates**: WebSocket integration for live data
5. **Optimistic Updates**: Implement optimistic UI patterns

### Advanced Patterns

1. **Feature State**: Modular state for micro-frontends
2. **Meta-Reducers**: Global state transformation
3. **Custom Operators**: Domain-specific RxJS operators
4. **State Machines**: XState integration for complex flows

This state management architecture provides a robust foundation for building scalable Angular applications with predictable state management and excellent developer experience.
