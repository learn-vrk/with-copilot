# Testing Strategy Documentation

## Overview

This document outlines the comprehensive testing strategy for the Chef Habitat Package Explorer application. It covers unit testing, integration testing, end-to-end testing, and performance testing approaches.

## Testing Philosophy

### Testing Principles

1. **Test Pyramid**: More unit tests, fewer integration tests, minimal E2E tests
2. **Test-Driven Development**: Write tests before implementation when possible
3. **Behavior-Driven**: Focus on testing behavior, not implementation details
4. **Maintainable Tests**: Clear, readable, and easy to maintain test code
5. **Fast Feedback**: Quick test execution for rapid development cycles

### Coverage Goals

- **Unit Tests**: 90%+ code coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Happy path scenarios
- **Performance Tests**: Key performance metrics

## Testing Stack

### Core Testing Tools

```json
{
  "frameworks": {
    "unit": "Jasmine",
    "runner": "Karma",
    "e2e": "Cypress",
    "utilities": "Angular Testing Utilities"
  },
  "libraries": {
    "mocking": "jasmine.createSpy",
    "testBed": "@angular/core/testing",
    "ngrx": "@ngrx/store/testing",
    "rxjs": "rxjs/testing"
  }
}
```

### Testing Configuration

#### Karma Configuration
```javascript
// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: true,
        seed: '4321'
      },
      clearContext: false
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
```

## Unit Testing

### Component Testing

#### Basic Component Test Structure
```typescript
describe('HabitatPackagesComponent', () => {
  let component: HabitatPackagesComponent;
  let fixture: ComponentFixture<HabitatPackagesComponent>;
  let mockStore: MockStore;
  let mockActions: Observable<Action>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitatPackagesComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        GridModule,
        InputsModule,
        ButtonsModule,
        LayoutModule,
        IndicatorsModule
      ],
      providers: [
        provideMockStore({
          initialState: {
            habitat: {
              packages: [],
              loading: false,
              error: null,
              totalCount: 0,
              currentPage: 0,
              pageSize: 10,
              searchQuery: ''
            }
          }
        }),
        provideMockActions(() => mockActions)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitatPackagesComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockActions = TestBed.inject(Actions);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadPackages on init', () => {
    spyOn(mockStore, 'dispatch');
    
    component.ngOnInit();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      HabitatActions.loadPackages({ page: 0 })
    );
  });

  it('should handle search input changes', fakeAsync(() => {
    spyOn(mockStore, 'dispatch');
    
    component.ngOnInit();
    component.searchControl.setValue('nginx');
    
    tick(300); // Wait for debounce
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      HabitatActions.searchPackages({ query: 'nginx' })
    );
  }));
});
```

#### Testing Component Interactions
```typescript
describe('HabitatPackagesComponent Interactions', () => {
  let component: HabitatPackagesComponent;
  let fixture: ComponentFixture<HabitatPackagesComponent>;

  beforeEach(async () => {
    // ... setup
  });

  it('should copy install command to clipboard', async () => {
    const mockPackage: HabitatPackage = {
      origin: 'core',
      name: 'nginx',
      version: '1.21.0',
      release: '20240301120000',
      channels: ['stable'],
      platforms: ['x86_64-linux']
    };

    // Mock clipboard API
    const mockClipboard = {
      writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve())
    };
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true
    });

    component.copyInstallCommand(mockPackage);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      'hab pkg install core/nginx/1.21.0/20240301120000'
    );
  });

  it('should get correct badge class for channel', () => {
    expect(component.getChannelBadgeClass('stable')).toBe('badge-success');
    expect(component.getChannelBadgeClass('unstable')).toBe('badge-warning');
    expect(component.getChannelBadgeClass('lts-2024')).toBe('badge-info');
    expect(component.getChannelBadgeClass('unknown')).toBe('badge-secondary');
  });

  it('should track packages correctly', () => {
    const mockPackage: HabitatPackage = {
      origin: 'core',
      name: 'nginx',
      version: '1.21.0',
      release: '20240301120000',
      channels: ['stable'],
      platforms: ['x86_64-linux']
    };

    const trackingId = component.trackByPackage(0, mockPackage);
    
    expect(trackingId).toBe('core/nginx/1.21.0/20240301120000');
  });
});
```

### Service Testing

#### Service Test Structure
```typescript
describe('HabitatService', () => {
  let service: HabitatService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HabitatService]
    });

    service = TestBed.inject(HabitatService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return mock packages with correct structure', (done) => {
    const expectedResponse = jasmine.objectContaining({
      range_start: jasmine.any(Number),
      range_end: jasmine.any(Number),
      total_count: jasmine.any(Number),
      data: jasmine.any(Array)
    });

    service.getPackages(0).subscribe(response => {
      expect(response).toEqual(expectedResponse);
      expect(response.data.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should filter packages by search query', (done) => {
    service.getPackages(0, 'nginx').subscribe(response => {
      const nginxPackages = response.data.filter(pkg => 
        pkg.name.toLowerCase().includes('nginx')
      );
      expect(nginxPackages.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should implement pagination correctly', (done) => {
    const pageSize = 10;
    
    service.getPackages(1).subscribe(response => {
      expect(response.range_start).toBe(pageSize);
      expect(response.range_end).toBe((pageSize * 2) - 1);
      done();
    });
  });
});
```

### NgRX Testing

#### Reducer Testing
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

  it('should return initial state', () => {
    const action = {} as any;
    const state = habitatReducer(undefined, action);
    
    expect(state).toBe(initialState);
  });

  it('should set loading to true on loadPackages', () => {
    const action = HabitatActions.loadPackages({ page: 0 });
    const state = habitatReducer(initialState, action);
    
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
    expect(state.currentPage).toBe(0);
  });

  it('should update packages on loadPackagesSuccess', () => {
    const mockResponse: HabitatPackageResponse = {
      range_start: 0,
      range_end: 1,
      total_count: 2,
      data: [
        {
          origin: 'core',
          name: 'nginx',
          version: '1.21.0',
          release: '20240301120000',
          channels: ['stable'],
          platforms: ['x86_64-linux']
        }
      ]
    };

    const action = HabitatActions.loadPackagesSuccess({ response: mockResponse });
    const state = habitatReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.packages).toEqual(mockResponse.data);
    expect(state.totalCount).toBe(mockResponse.total_count);
    expect(state.error).toBe(null);
  });

  it('should handle error on loadPackagesFailure', () => {
    const errorMessage = 'Network error';
    const action = HabitatActions.loadPackagesFailure({ error: errorMessage });
    const state = habitatReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
```

#### Effects Testing
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
    const mockResponse: HabitatPackageResponse = {
      range_start: 0,
      range_end: 9,
      total_count: 100,
      data: []
    };

    const action = HabitatActions.loadPackages({ page: 0 });
    const outcome = HabitatActions.loadPackagesSuccess({ response: mockResponse });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: mockResponse });
    service.getPackages.and.returnValue(response);

    const expected = cold('--b', { b: outcome });
    expect(effects.loadPackages$).toBeObservable(expected);
  });

  it('should return loadPackagesFailure on service error', () => {
    const action = HabitatActions.loadPackages({ page: 0 });
    const error = new Error('Service error');
    const outcome = HabitatActions.loadPackagesFailure({ error: error.message });

    actions$ = hot('-a', { a: action });
    const response = cold('-#|', {}, error);
    service.getPackages.and.returnValue(response);

    const expected = cold('--b', { b: outcome });
    expect(effects.loadPackages$).toBeObservable(expected);
  });
});
```

#### Selector Testing
```typescript
describe('Habitat Selectors', () => {
  const mockState: { habitat: HabitatState } = {
    habitat: {
      packages: [
        {
          origin: 'core',
          name: 'nginx',
          version: '1.21.0',
          release: '20240301120000',
          channels: ['stable'],
          platforms: ['x86_64-linux']
        },
        {
          origin: 'core',
          name: 'redis',
          version: '7.0.0',
          release: '20240301120000',
          channels: ['stable', 'unstable'],
          platforms: ['x86_64-linux']
        }
      ],
      loading: false,
      error: null,
      totalCount: 2,
      currentPage: 0,
      pageSize: 10,
      searchQuery: ''
    }
  };

  it('should select packages', () => {
    const result = selectPackages.projector(mockState.habitat);
    expect(result).toEqual(mockState.habitat.packages);
  });

  it('should select loading state', () => {
    const result = selectLoading.projector(mockState.habitat);
    expect(result).toBe(false);
  });

  it('should calculate hasMorePackages correctly', () => {
    const result = selectHasMorePackages.projector(mockState.habitat);
    expect(result).toBe(false); // 2 packages out of 2 total
  });

  it('should create grid data structure', () => {
    const result = selectGridData.projector(
      mockState.habitat.packages,
      mockState.habitat.totalCount
    );
    
    expect(result).toEqual({
      data: mockState.habitat.packages,
      total: mockState.habitat.totalCount
    });
  });
});
```

## Integration Testing

### Component Integration Tests

```typescript
describe('HabitatPackagesComponent Integration', () => {
  let component: HabitatPackagesComponent;
  let fixture: ComponentFixture<HabitatPackagesComponent>;
  let store: Store;
  let service: HabitatService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitatPackagesComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({
          habitat: habitatReducer
        }),
        EffectsModule.forRoot([HabitatEffects]),
        GridModule,
        InputsModule,
        ButtonsModule,
        LayoutModule,
        IndicatorsModule
      ],
      providers: [HabitatService]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitatPackagesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    service = TestBed.inject(HabitatService);
  });

  it('should load packages on initialization', (done) => {
    spyOn(service, 'getPackages').and.callThrough();
    
    component.ngOnInit();
    fixture.detectChanges();
    
    component.packages$.subscribe(packages => {
      expect(service.getPackages).toHaveBeenCalled();
      expect(packages.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should perform search with debouncing', fakeAsync(() => {
    spyOn(service, 'getPackages').and.callThrough();
    
    component.ngOnInit();
    fixture.detectChanges();
    
    // Simulate rapid typing
    component.searchControl.setValue('n');
    tick(100);
    component.searchControl.setValue('ng');
    tick(100);
    component.searchControl.setValue('ngi');
    tick(100);
    component.searchControl.setValue('nginx');
    tick(300); // Wait for debounce
    
    expect(service.getPackages).toHaveBeenCalledWith(0, 'nginx');
  }));
});
```

### Store Integration Tests

```typescript
describe('Store Integration', () => {
  let store: Store;
  let service: HabitatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          habitat: habitatReducer
        }),
        EffectsModule.forRoot([HabitatEffects])
      ],
      providers: [HabitatService]
    });

    store = TestBed.inject(Store);
    service = TestBed.inject(HabitatService);
  });

  it('should handle complete load packages flow', (done) => {
    spyOn(service, 'getPackages').and.callThrough();
    
    let loadingStates: boolean[] = [];
    let finalPackages: HabitatPackage[] = [];
    
    // Track loading states
    store.select(selectLoading).subscribe(loading => {
      loadingStates.push(loading);
    });
    
    // Track final packages
    store.select(selectPackages).subscribe(packages => {
      if (packages.length > 0) {
        finalPackages = packages;
      }
    });
    
    // Dispatch action
    store.dispatch(HabitatActions.loadPackages({ page: 0 }));
    
    setTimeout(() => {
      expect(loadingStates).toEqual([false, true, false]);
      expect(finalPackages.length).toBeGreaterThan(0);
      expect(service.getPackages).toHaveBeenCalled();
      done();
    }, 600); // Wait for async operations
  });
});
```

## End-to-End Testing

### Cypress Test Structure

```typescript
// cypress/integration/habitat-packages.spec.ts
describe('Habitat Packages', () => {
  beforeEach(() => {
    cy.visit('/packages');
  });

  it('should display package grid', () => {
    cy.get('[data-cy=package-grid]').should('be.visible');
    cy.get('[data-cy=package-row]').should('have.length.greaterThan', 0);
  });

  it('should search packages', () => {
    cy.get('[data-cy=search-input]').type('nginx');
    cy.get('[data-cy=package-row]').should('contain.text', 'nginx');
  });

  it('should clear search', () => {
    cy.get('[data-cy=search-input]').type('nginx');
    cy.get('[data-cy=clear-button]').click();
    cy.get('[data-cy=search-input]').should('have.value', '');
  });

  it('should copy install command', () => {
    cy.get('[data-cy=copy-command-button]').first().click();
    cy.window().its('navigator.clipboard')
      .invoke('readText')
      .should('contain', 'hab pkg install');
  });

  it('should open package details', () => {
    cy.get('[data-cy=view-package-button]').first().click();
    cy.window().its('open').should('have.been.called');
  });
});
```

### Performance Testing

```typescript
// cypress/integration/performance.spec.ts
describe('Performance Tests', () => {
  it('should load packages within acceptable time', () => {
    const startTime = performance.now();
    
    cy.visit('/packages');
    cy.get('[data-cy=package-grid]').should('be.visible');
    
    cy.then(() => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      expect(loadTime).to.be.lessThan(2000); // 2 seconds
    });
  });

  it('should handle large dataset efficiently', () => {
    cy.intercept('GET', '/api/packages', { fixture: 'large-dataset.json' });
    
    cy.visit('/packages');
    cy.get('[data-cy=package-grid]').should('be.visible');
    
    // Measure scroll performance
    cy.get('[data-cy=package-grid]').scrollTo('bottom');
    cy.get('[data-cy=package-row]').should('have.length.greaterThan', 10);
  });
});
```

## Test Utilities

### Mock Data Factory

```typescript
// test/mock-data.ts
export class MockDataFactory {
  static createHabitatPackage(overrides?: Partial<HabitatPackage>): HabitatPackage {
    return {
      origin: 'core',
      name: 'nginx',
      version: '1.21.0',
      release: '20240301120000',
      channels: ['stable'],
      platforms: ['x86_64-linux'],
      ...overrides
    };
  }

  static createPackageResponse(
    count: number = 10,
    overrides?: Partial<HabitatPackageResponse>
  ): HabitatPackageResponse {
    const packages = Array.from({ length: count }, (_, i) =>
      this.createHabitatPackage({ name: `package-${i}` })
    );

    return {
      range_start: 0,
      range_end: count - 1,
      total_count: count,
      data: packages,
      ...overrides
    };
  }
}
```

### Test Helpers

```typescript
// test/test-helpers.ts
export class TestHelpers {
  static async waitForAsync(fixture: ComponentFixture<any>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  static triggerInputChange(
    fixture: ComponentFixture<any>,
    selector: string,
    value: string
  ): void {
    const input = fixture.debugElement.query(By.css(selector));
    input.nativeElement.value = value;
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  static expectElementToContainText(
    fixture: ComponentFixture<any>,
    selector: string,
    text: string
  ): void {
    const element = fixture.debugElement.query(By.css(selector));
    expect(element.nativeElement.textContent).toContain(text);
  }
}
```

## Testing Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "test": "ng test --watch=false",
    "test:watch": "ng test",
    "test:coverage": "ng test --code-coverage --watch=false",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless",
    "e2e": "cypress open",
    "e2e:headless": "cypress run",
    "e2e:ci": "cypress run --record --key $CYPRESS_RECORD_KEY"
  }
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:ci
    
    - name: Run e2e tests
      run: npm run e2e:headless
    
    - name: Upload coverage
      uses: codecov/codecov-action@v2
      with:
        file: ./coverage/lcov.info
```

## Best Practices

### Testing Guidelines

1. **AAA Pattern**: Arrange, Act, Assert
2. **Descriptive Names**: Tests should describe behavior
3. **Single Responsibility**: One assertion per test
4. **Fast Execution**: Keep tests fast and isolated
5. **Reliable**: Tests should be deterministic

### Common Patterns

```typescript
// ✅ Good: Descriptive test name
it('should display error message when package loading fails', () => {
  // Test implementation
});

// ❌ Bad: Vague test name
it('should handle error', () => {
  // Test implementation
});

// ✅ Good: Single assertion
it('should set loading to true when loadPackages is dispatched', () => {
  const action = HabitatActions.loadPackages({ page: 0 });
  const state = habitatReducer(initialState, action);
  
  expect(state.loading).toBe(true);
});

// ✅ Good: Proper test isolation
beforeEach(() => {
  TestBed.configureTestingModule({
    // Clean setup for each test
  });
});
```

### Test Maintenance

1. **Keep Tests Updated**: Update tests with code changes
2. **Remove Obsolete Tests**: Clean up unused tests
3. **Refactor Test Code**: Apply same quality standards
4. **Documentation**: Document complex test scenarios

This comprehensive testing strategy ensures code quality, reliability, and maintainability while providing fast feedback during development.
