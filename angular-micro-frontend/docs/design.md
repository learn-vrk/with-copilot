# Chef Habitat Package Explorer - Design Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [UI/UX Design](#uiux-design)
3. [Technical Design](#technical-design)
4. [State Management](#state-management)
5. [Component Design](#component-design)
6. [API Design](#api-design)
7. [Performance Considerations](#performance-considerations)
8. [Security Considerations](#security-considerations)

## Architecture Overview

### High-Level Architecture

The Chef Habitat Package Explorer is built using Angular 18 with a micro-frontend architecture pattern. The application follows modern Angular best practices and uses NgRX for state management.

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser                                 │
├─────────────────────────────────────────────────────────────┤
│                  Shell Application                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │   App Module    │ │   Routing       │ │   Global      │ │
│  │                 │ │   Module        │ │   Services    │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                Component Layer                              │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │   App           │ │   Habitat       │                   │
│  │   Component     │ │   Packages      │                   │
│  │                 │ │   Component     │                   │
│  └─────────────────┘ └─────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                State Management (NgRX)                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │    Actions      │ │    Reducers     │ │    Effects    │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │   Selectors     │ │     Store       │                   │
│  └─────────────────┘ └─────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                Service Layer                                │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │   Habitat       │ │     HTTP        │                   │
│  │   Service       │ │     Client      │                   │
│  └─────────────────┘ └─────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                Data Layer                                   │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │   Mock Data     │ │   API Models    │                   │
│  │   (Current)     │ │   (Future)      │                   │
│  └─────────────────┘ └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Angular 18
- **State Management**: NgRX 18
- **UI Library**: Kendo UI for Angular
- **Styling**: SCSS with Kendo Default Theme
- **Build System**: Angular CLI with Webpack Module Federation
- **Testing**: Jasmine + Karma
- **Type System**: TypeScript 5.4

### Design Principles

1. **Micro-Frontend Ready**: Modular architecture supporting independent deployment
2. **Reactive Programming**: RxJS observables for data flow
3. **Immutable State**: NgRX ensures predictable state management
4. **Component-Driven**: Reusable, testable components
5. **Responsive Design**: Mobile-first approach
6. **Accessibility**: WCAG 2.1 compliance
7. **Performance**: Lazy loading and optimization

## UI/UX Design

### Design System

#### Color Palette

- **Primary**: Kendo Default Theme Blues
  - Primary: #ff6358 (Kendo Primary)
  - Secondary: #f5f5f5 (Light Gray)
  - Success: #37b400 (Green)
  - Warning: #ffc000 (Orange)
  - Error: #f31700 (Red)

#### Typography

- **Primary Font**: Roboto, Arial, sans-serif
- **Headings**: Bold weights (500-700)
- **Body Text**: Regular weight (400)
- **Code**: Consolas, Monaco, monospace

#### Spacing System

- **Base Unit**: 8px
- **Spacing Scale**: 4px, 8px, 16px, 24px, 32px, 48px, 64px

### User Experience

#### Navigation Flow

```
Home Page
    ↓
Package List (Main View)
    ├── Search Packages
    ├── View Package Details (External Link)
    ├── Copy Install Command
    └── Pagination
```

#### Interaction Patterns

1. **Search**: Real-time search with 300ms debouncing
2. **Loading States**: Kendo Loader component for async operations
3. **Error Handling**: Toast notifications and inline error messages
4. **Responsive**: Grid adapts to screen size

### Visual Hierarchy

1. **Header**: Application title and navigation
2. **Search Bar**: Prominent search input with clear action
3. **Package Grid**: Card-based layout with clear information hierarchy
4. **Package Cards**: 
   - Package name (prominent)
   - Version and channel information
   - Action buttons (view, copy command)

## Technical Design

### Component Architecture

```
AppComponent (Root)
├── RouterOutlet
└── HabitatPackagesComponent
    ├── Kendo Card (Search Section)
    │   ├── Kendo TextBox (Search Input)
    │   └── Kendo Button (Clear)
    ├── Kendo Loader (Loading State)
    └── Kendo Grid (Package Display)
        ├── Grid Columns
        │   ├── Package Name
        │   ├── Version
        │   ├── Channels (Badge)
        │   └── Actions
        └── Grid Pagination
```

### Data Flow

```
Component → Action → Effect → Service → API/Mock → Success/Error → Reducer → Selector → Component
```

1. **User Interaction**: User types in search box
2. **Action Dispatch**: Component dispatches `searchPackages` action
3. **Effect Processing**: Effect intercepts action, calls service
4. **Service Call**: Service returns observable with data
5. **State Update**: Reducer updates state based on success/failure
6. **UI Update**: Component receives new state via selectors

### Module Federation Setup

```typescript
// webpack.config.js (Future Enhancement)
module.exports = {
  mode: "development",
  devtool: "source-map",
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        // Future micro-frontends can be added here
      }
    })
  ]
};
```

## State Management

### NgRX Architecture

#### State Shape

```typescript
interface AppState {
  app: {
    message: string;
    loading: boolean;
    error: string | null;
  };
  habitat: {
    packages: HabitatPackage[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    pageSize: number;
    searchQuery: string;
  };
}
```

#### Action Categories

1. **Load Actions**: `loadPackages`, `loadMorePackages`
2. **Search Actions**: `searchPackages`
3. **Success Actions**: `loadPackagesSuccess`
4. **Failure Actions**: `loadPackagesFailure`
5. **Utility Actions**: `clearPackages`

#### Effect Patterns

```typescript
// Example Effect Pattern
loadPackages$ = createEffect(() =>
  this.actions$.pipe(
    ofType(HabitatActions.loadPackages),
    switchMap(({ page, searchQuery }) =>
      this.service.getPackages(page, searchQuery).pipe(
        map(response => HabitatActions.loadPackagesSuccess({ response })),
        catchError(error => of(HabitatActions.loadPackagesFailure({ error })))
      )
    )
  )
);
```

## Component Design

### HabitatPackagesComponent

#### Responsibilities

1. **Display Management**: Render package list using Kendo Grid
2. **User Interactions**: Handle search, pagination, and actions
3. **State Subscription**: Subscribe to NgRX store observables
4. **Action Dispatching**: Dispatch actions for state changes

#### Key Features

1. **Search Functionality**:
   - Debounced input (300ms)
   - Clear search option
   - Real-time filtering

2. **Package Display**:
   - Grid view with sortable columns
   - Channel badges with color coding
   - Responsive column layout

3. **Actions**:
   - View package details (external link)
   - Copy install command to clipboard
   - Load more packages (pagination)

#### Component Lifecycle

```typescript
ngOnInit() {
  // Initialize store subscriptions
  // Set up search form control
  // Load initial packages
}

ngOnDestroy() {
  // Clean up subscriptions
  // Prevent memory leaks
}
```

### Kendo UI Integration

#### Grid Configuration

```typescript
// Grid state management
state: State = {
  skip: 0,
  take: 10
};

// Grid data observable
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

#### Theme Integration

- **Default Theme**: Kendo UI Default theme for consistent styling
- **Responsive**: Grid adapts to different screen sizes
- **Accessibility**: Built-in ARIA support

## API Design

### Current Implementation (Mock Data)

#### Service Interface

```typescript
interface HabitatService {
  getPackages(page?: number, searchQuery?: string): Observable<HabitatPackageResponse>;
  tryRealAPI(page?: number, searchQuery?: string): Observable<HabitatPackageResponse>;
}
```

#### Data Models

```typescript
interface HabitatPackage {
  origin: string;
  name: string;
  version: string;
  release: string;
  channels: string[];
  platforms: string[];
}

interface HabitatPackageResponse {
  range_start: number;
  range_end: number;
  total_count: number;
  data: HabitatPackage[];
}
```

### Future Real API Integration

#### API Endpoints

```
GET /v1/depot/pkgs/core
Query Parameters:
- range: "0-49" (pagination)
- q: "search-term" (search query)
```

#### CORS Handling

For production deployment, a backend proxy would be needed:

```
Browser → Backend Proxy → Chef Habitat Builder API
```

## Performance Considerations

### Optimization Strategies

1. **OnPush Change Detection**: Components use OnPush strategy where applicable
2. **Lazy Loading**: Routes and modules loaded on demand
3. **Virtual Scrolling**: For large datasets (future enhancement)
4. **Memoized Selectors**: NgRX selectors prevent unnecessary recalculations
5. **Debounced Search**: Prevents excessive API calls
6. **TrackBy Functions**: Optimize *ngFor rendering

### Bundle Optimization

```typescript
// Lazy loading example (future enhancement)
const routes: Routes = [
  {
    path: 'packages',
    loadChildren: () => import('./habitat/habitat.module').then(m => m.HabitatModule)
  }
];
```

### Memory Management

1. **Subscription Cleanup**: Using takeUntil pattern
2. **OnDestroy Implementation**: Proper component cleanup
3. **Observable Unsubscription**: Preventing memory leaks

## Security Considerations

### Data Security

1. **Input Sanitization**: Angular's built-in XSS protection
2. **HTTPS Only**: All API communications over HTTPS
3. **CSP Headers**: Content Security Policy implementation

### Authentication (Future)

```typescript
// Future authentication pattern
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

### API Security

1. **CORS Configuration**: Proper CORS headers for API access
2. **Rate Limiting**: Implement client-side rate limiting
3. **Error Handling**: Don't expose internal error details

## Browser Support

### Supported Browsers

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Progressive Enhancement

1. **Core Functionality**: Works without JavaScript (future)
2. **Enhanced Experience**: Full functionality with modern browsers
3. **Graceful Degradation**: Fallbacks for older browsers

## Accessibility

### WCAG 2.1 Compliance

1. **Keyboard Navigation**: Full keyboard accessibility
2. **Screen Reader Support**: Proper ARIA labels and roles
3. **Color Contrast**: Meets AA standards
4. **Focus Management**: Visible focus indicators

### Implementation

```typescript
// Example accessibility features
<kendo-grid 
  [data]="gridData$ | async"
  [attr.aria-label]="'Habitat packages grid'"
  role="grid">
```

## Future Enhancements

### Planned Features

1. **Real API Integration**: Direct connection to Habitat Builder API
2. **Advanced Filtering**: Multi-faceted package filtering
3. **Package Comparison**: Side-by-side package comparison
4. **Favorites System**: Save favorite packages
5. **Export Functionality**: Export package lists
6. **Dark Mode**: Theme switching capability

### Technical Improvements

1. **Service Worker**: Offline capability
2. **Virtual Scrolling**: Handle large datasets
3. **Infinite Scroll**: Alternative to pagination
4. **Advanced Caching**: Intelligent cache management
5. **Real-time Updates**: WebSocket integration

## Conclusion

This design documentation provides a comprehensive overview of the Chef Habitat Package Explorer's architecture, design decisions, and implementation details. The application follows modern Angular best practices and provides a solid foundation for future enhancements and scalability.
