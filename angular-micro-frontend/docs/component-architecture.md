# Component Architecture Documentation

## Overview

This document provides detailed documentation of the component architecture for the Chef Habitat Package Explorer. It covers the component hierarchy, data flow, and implementation details.

## Component Hierarchy

```
AppComponent (Shell)
├── Router Outlet
│   ├── AppComponent (Home)
│   └── HabitatPackagesComponent (Packages)
│       ├── Search Section
│       │   ├── Kendo Card
│       │   ├── Kendo TextBox
│       │   └── Kendo Button
│       ├── Loading Section
│       │   └── Kendo Loader
│       └── Results Section
│           ├── Kendo Grid
│           │   ├── Grid Columns
│           │   ├── Grid Rows
│           │   └── Grid Pagination
│           └── Channel Badge (Custom)
```

## Core Components

### AppComponent (Root Shell)

#### Purpose
The root component that serves as the application shell, providing global layout and navigation.

#### Responsibilities
- Application initialization
- Global state management
- Navigation structure
- Route configuration

#### Interface
```typescript
export interface AppComponent {
  title: string;
  message$: Observable<string>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  updateMessage(message: string): void;
  loadMessage(): void;
  isHomePage(): boolean;
}
```

#### Template Structure
```html
<div class="app-container">
  <header class="app-header">
    <h1>{{ title }}</h1>
    <!-- Navigation will be added here -->
  </header>
  
  <main class="app-main">
    <router-outlet></router-outlet>
  </main>
  
  <footer class="app-footer">
    <!-- Footer content -->
  </footer>
</div>
```

#### State Management
- **Store Dependencies**: App state slice
- **Selectors**: `selectMessage`, `selectLoading`, `selectError`
- **Actions**: `loadMessage`, `updateMessage`

### HabitatPackagesComponent (Main Feature)

#### Purpose
The primary component for displaying and managing Chef Habitat packages with search, filtering, and pagination capabilities.

#### Responsibilities
- Package data display
- Search functionality
- Pagination management
- User interactions (view, copy commands)
- Loading and error states

#### Interface
```typescript
export interface HabitatPackagesComponent {
  // Observables
  packages$: Observable<HabitatPackage[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;
  hasMorePackages$: Observable<boolean>;
  gridData$: Observable<GridDataResult>;
  
  // Grid state
  state: State;
  
  // Form controls
  searchControl: FormControl;
  
  // Methods
  loadMorePackages(): void;
  clearSearch(): void;
  onDataStateChange(state: DataStateChangeEvent): void;
  onSearch(): void;
  viewPackage(pkg: HabitatPackage): void;
  copyInstallCommand(pkg: HabitatPackage): void;
  getChannelBadgeClass(channel: string): string;
  trackByPackage(index: number, pkg: HabitatPackage): string;
  tryRealAPI(): void;
}
```

#### Template Structure
```html
<div class="habitat-packages-container">
  <!-- Search Section -->
  <kendo-card class="search-card">
    <kendo-card-body>
      <div class="search-section">
        <kendo-textbox 
          [formControl]="searchControl"
          placeholder="Search packages..."
          [clearButton]="true">
        </kendo-textbox>
        <kendo-button 
          (click)="clearSearch()"
          [disabled]="loading$ | async">
          Clear
        </kendo-button>
      </div>
    </kendo-card-body>
  </kendo-card>

  <!-- Loading State -->
  <div *ngIf="loading$ | async" class="loading-container">
    <kendo-loader type="converging-spinner"></kendo-loader>
  </div>

  <!-- Results Grid -->
  <kendo-grid 
    [data]="gridData$ | async"
    [loading]="loading$ | async"
    [pageable]="true"
    [sortable]="true"
    (dataStateChange)="onDataStateChange($event)">
    
    <!-- Grid columns defined here -->
    
  </kendo-grid>

  <!-- Error State -->
  <div *ngIf="error$ | async as error" class="error-container">
    <p class="error-message">{{ error }}</p>
  </div>
</div>
```

#### Lifecycle Hooks
```typescript
ngOnInit(): void {
  // Initialize store subscriptions
  this.packages$ = this.store.select(HabitatSelectors.selectPackages);
  this.loading$ = this.store.select(HabitatSelectors.selectLoading);
  
  // Set up form controls
  this.searchControl = new FormControl('');
  
  // Set up search subscription with debouncing
  this.searchControl.valueChanges.pipe(
    takeUntil(this.destroy$),
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(query => {
    if (query !== null) {
      this.store.dispatch(HabitatActions.searchPackages({ query }));
    }
  });
  
  // Load initial data
  this.store.dispatch(HabitatActions.loadPackages({ page: 0 }));
}

ngOnDestroy(): void {
  // Clean up subscriptions
  this.destroy$.next();
  this.destroy$.complete();
}
```

#### State Management
- **Store Dependencies**: Habitat state slice
- **Selectors**: All habitat selectors
- **Actions**: All habitat actions
- **Effects**: Handled by HabitatEffects

### Custom Channel Badge Component

#### Purpose
A reusable component for displaying package channel information with appropriate styling.

#### Implementation
```typescript
@Component({
  selector: 'app-channel-badge',
  template: `
    <span class="channel-badge" [ngClass]="getBadgeClass()">
      {{ channel }}
    </span>
  `,
  styles: [`
    .channel-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .badge-success { background-color: #37b400; color: white; }
    .badge-warning { background-color: #ffc000; color: white; }
    .badge-info { background-color: #0078d4; color: white; }
    .badge-secondary { background-color: #6c757d; color: white; }
  `]
})
export class ChannelBadgeComponent {
  @Input() channel: string;
  
  getBadgeClass(): string {
    switch (this.channel.toLowerCase()) {
      case 'stable': return 'badge-success';
      case 'unstable': return 'badge-warning';
      case 'lts-2024': return 'badge-info';
      default: return 'badge-secondary';
    }
  }
}
```

## Data Flow Architecture

### Component to Store Communication

```typescript
// Action Dispatch Flow
Component → Action → Effect → Service → API/Mock → Success/Error → Reducer → Store

// State Selection Flow
Store → Selector → Observable → Component → Template
```

### Example Data Flow: Search Operation

1. **User Input**: User types in search box
2. **Form Control**: FormControl emits value change
3. **Debouncing**: RxJS debounceTime operator delays emission
4. **Action Dispatch**: Component dispatches `searchPackages` action
5. **Effect Processing**: `searchPackages$` effect intercepts action
6. **Service Call**: Effect calls `HabitatService.getPackages()`
7. **API Response**: Service returns mock data observable
8. **Success Action**: Effect dispatches `loadPackagesSuccess`
9. **State Update**: Reducer updates packages array
10. **UI Update**: Component receives new state via selector

### Observable Patterns

#### Combining Observables
```typescript
// Grid data combining packages and total count
gridData$: Observable<GridDataResult> = combineLatest([
  this.packages$,
  this.totalCount$
]).pipe(
  map(([packages, total]) => ({
    data: packages || [],
    total: total || 0
  }))
);
```

#### Error Handling
```typescript
// Effect error handling
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
```

## Component Communication

### Parent-Child Communication

#### Props Down
```typescript
// Parent component
<app-channel-badge [channel]="package.channel"></app-channel-badge>

// Child component
@Component({...})
export class ChannelBadgeComponent {
  @Input() channel: string;
}
```

#### Events Up
```typescript
// Child component
@Component({...})
export class PackageCardComponent {
  @Output() packageSelected = new EventEmitter<HabitatPackage>();
  
  onPackageClick(pkg: HabitatPackage): void {
    this.packageSelected.emit(pkg);
  }
}

// Parent component
<app-package-card 
  [package]="pkg" 
  (packageSelected)="onPackageSelected($event)">
</app-package-card>
```

### Service Communication

#### Injection and Usage
```typescript
@Component({...})
export class HabitatPackagesComponent {
  constructor(
    private store: Store,
    private habitatService: HabitatService
  ) {}
  
  // Service methods are called through effects
  // Component only interacts with store
}
```

## Component Testing

### Unit Testing Strategy

#### Component Testing
```typescript
describe('HabitatPackagesComponent', () => {
  let component: HabitatPackagesComponent;
  let fixture: ComponentFixture<HabitatPackagesComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitatPackagesComponent],
      imports: [
        ReactiveFormsModule,
        GridModule,
        // ... other Kendo modules
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
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitatPackagesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadPackages on init', () => {
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      HabitatActions.loadPackages({ page: 0 })
    );
  });
});
```

#### Service Testing
```typescript
describe('HabitatService', () => {
  let service: HabitatService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HabitatService]
    });
    
    service = TestBed.inject(HabitatService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should return mock packages', (done) => {
    service.getPackages(0, 'nginx').subscribe(response => {
      expect(response.data).toBeDefined();
      expect(response.total_count).toBeGreaterThan(0);
      done();
    });
  });
});
```

## Performance Optimizations

### Change Detection Strategy

#### OnPush Strategy
```typescript
@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageCardComponent {
  @Input() package: HabitatPackage;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  // Manual change detection when needed
  updateView(): void {
    this.cdr.markForCheck();
  }
}
```

#### TrackBy Functions
```typescript
@Component({...})
export class HabitatPackagesComponent {
  trackByPackage(index: number, pkg: HabitatPackage): string {
    return `${pkg.origin}/${pkg.name}/${pkg.version}/${pkg.release}`;
  }
}
```

### Memory Management

#### Subscription Cleanup
```typescript
export class HabitatPackagesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      // Handle search
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Future Component Enhancements

### Planned Components

1. **PackageDetailComponent**: Detailed package information
2. **FilterPanelComponent**: Advanced filtering options
3. **ComparisonComponent**: Side-by-side package comparison
4. **FavoritesComponent**: User favorites management
5. **ExportComponent**: Data export functionality

### Architecture Improvements

1. **Lazy Loading**: Component-level lazy loading
2. **Virtual Scrolling**: Large dataset handling
3. **Infinite Scroll**: Alternative pagination
4. **Component Library**: Reusable component library
5. **Micro-Frontend**: Split into separate micro-frontends

This component architecture provides a solid foundation for building scalable, maintainable, and testable Angular applications with modern best practices.
