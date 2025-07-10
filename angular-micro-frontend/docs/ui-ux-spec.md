# UI/UX Design Specification

## Overview

This document details the user interface and user experience design for the Chef Habitat Package Explorer application. The design emphasizes simplicity, efficiency, and modern web standards.

## Design Principles

### Core Principles

1. **Simplicity First**: Clean, uncluttered interface focused on the primary task
2. **Responsive Design**: Seamless experience across all device sizes
3. **Performance Oriented**: Fast loading and smooth interactions
4. **Accessible**: WCAG 2.1 AA compliant design
5. **Consistent**: Unified design language throughout the application

### User-Centered Design

- **Task-Focused**: Optimized for browsing and searching packages
- **Scannable**: Easy to scan and find relevant information
- **Actionable**: Clear calls-to-action for common tasks
- **Forgiving**: Error states and loading indicators

## Visual Design System

### Color Palette

#### Primary Colors
```scss
$primary-color: #ff6358;      // Kendo Primary Red
$primary-dark: #e55347;       // Darker variant for hover states
$primary-light: #ff8a82;      // Lighter variant for backgrounds
```

#### Secondary Colors
```scss
$secondary-color: #f5f5f5;    // Light gray backgrounds
$text-primary: #333333;       // Main text color
$text-secondary: #666666;     // Secondary text color
$text-muted: #999999;         // Muted text color
```

#### Status Colors
```scss
$success-color: #37b400;      // Success states, stable channel
$warning-color: #ffc000;      // Warning states, unstable channel
$error-color: #f31700;        // Error states
$info-color: #0078d4;         // Info states, LTS channel
```

#### Channel Badge Colors
```scss
$stable-badge: $success-color;
$unstable-badge: $warning-color;
$lts-badge: $info-color;
$default-badge: #6c757d;      // Default for unknown channels
```

### Typography

#### Font Families
```scss
$font-family-primary: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-family-mono: 'Consolas', 'Monaco', 'Courier New', monospace;
```

#### Font Sizes
```scss
$font-size-xs: 0.75rem;       // 12px - Small labels
$font-size-sm: 0.875rem;      // 14px - Body text
$font-size-base: 1rem;        // 16px - Base size
$font-size-lg: 1.125rem;      // 18px - Large text
$font-size-xl: 1.25rem;       // 20px - Headings
$font-size-xxl: 1.5rem;       // 24px - Large headings
```

#### Font Weights
```scss
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Spacing System

#### Base Units
```scss
$spacing-base: 8px;
$spacing-xs: 4px;     // 0.5 * base
$spacing-sm: 8px;     // 1 * base
$spacing-md: 16px;    // 2 * base
$spacing-lg: 24px;    // 3 * base
$spacing-xl: 32px;    // 4 * base
$spacing-xxl: 48px;   // 6 * base
$spacing-xxxl: 64px;  // 8 * base
```

### Border Radius
```scss
$border-radius-sm: 4px;       // Small elements
$border-radius-base: 8px;     // Default radius
$border-radius-lg: 12px;      // Large elements
$border-radius-xl: 16px;      // Extra large elements
```

### Shadows
```scss
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
$shadow-base: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 8px 25px rgba(0, 0, 0, 0.15);
```

## Layout Design

### Grid System

#### Breakpoints
```scss
$breakpoint-xs: 0;
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
$breakpoint-xxl: 1400px;
```

#### Container Widths
```scss
$container-sm: 540px;
$container-md: 720px;
$container-lg: 960px;
$container-xl: 1140px;
$container-xxl: 1320px;
```

### Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        Header                               │
│  ┌─────────────────┐                                       │
│  │  App Title      │                                       │
│  └─────────────────┘                                       │
├─────────────────────────────────────────────────────────────┤
│                      Main Content                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  Search Card                           │ │
│  │  ┌─────────────┐ ┌──────────┐                         │ │
│  │  │ Search Input│ │  Clear   │                         │ │
│  │  └─────────────┘ └──────────┘                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  Package Grid                          │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │ │
│  │  │ Pkg  │ │ Pkg  │ │ Pkg  │ │ Pkg  │                  │ │
│  │  │ Card │ │ Card │ │ Card │ │ Card │                  │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘                  │ │
│  │                                                         │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │               Pagination                            │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Specifications

### Header Component

#### Visual Design
- **Height**: 60px
- **Background**: White with bottom border
- **Typography**: App title in primary font, medium weight
- **Spacing**: 16px horizontal padding

#### Responsive Behavior
- **Mobile**: Stack title and navigation
- **Desktop**: Horizontal layout

### Search Card Component

#### Visual Design
- **Background**: White
- **Border**: 1px solid #e5e5e5
- **Border Radius**: 8px
- **Padding**: 24px
- **Shadow**: Subtle drop shadow

#### Elements
- **Search Input**: 
  - Full width minus button
  - Placeholder: "Search packages..."
  - Icon: Search icon (left side)
- **Clear Button**:
  - Secondary style
  - Text: "Clear"
  - Positioned to the right

#### States
- **Empty State**: Default placeholder
- **With Text**: Clear button enabled
- **Loading**: Input disabled with spinner

### Package Grid Component

#### Grid Layout
```scss
.package-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-md;
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}
```

#### Column Definitions
1. **Package Name**: 
   - Width: 25%
   - Font: Medium weight, base size
   - Color: Primary text color

2. **Version**: 
   - Width: 15%
   - Font: Normal weight, small size
   - Color: Secondary text color

3. **Channels**: 
   - Width: 25%
   - Badges with color coding
   - Multiple badges possible

4. **Platforms**: 
   - Width: 20%
   - Comma-separated list
   - Font: Small size

5. **Actions**: 
   - Width: 15%
   - Button group
   - Right-aligned

### Package Card Component (Alternative View)

#### Visual Design
- **Background**: White
- **Border**: 1px solid #e5e5e5
- **Border Radius**: 8px
- **Padding**: 16px
- **Hover State**: Subtle shadow increase

#### Content Structure
```
┌─────────────────────────────────────────┐
│  Package Name                  [Badge]  │
│  origin/name                            │
│                                         │
│  Version: 1.0.0                        │
│  Release: 20240301120000                │
│  Platforms: x86_64-linux, aarch64-linux│
│                                         │
│  [View Details] [Copy Command]          │
└─────────────────────────────────────────┘
```

### Channel Badge Component

#### Badge Variants
```scss
.channel-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: $border-radius-sm;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  text-transform: uppercase;
  
  &.stable {
    background-color: $success-color;
    color: white;
  }
  
  &.unstable {
    background-color: $warning-color;
    color: white;
  }
  
  &.lts {
    background-color: $info-color;
    color: white;
  }
  
  &.default {
    background-color: $default-badge;
    color: white;
  }
}
```

### Loading States

#### Skeleton Loading
```scss
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### Spinner Component
- **Size**: 24px diameter
- **Color**: Primary color
- **Animation**: Smooth rotation
- **Positioning**: Center of container

### Button Components

#### Primary Button
```scss
.btn-primary {
  background-color: $primary-color;
  border: 1px solid $primary-color;
  color: white;
  padding: 8px 16px;
  border-radius: $border-radius-base;
  font-weight: $font-weight-medium;
  
  &:hover {
    background-color: $primary-dark;
    border-color: $primary-dark;
  }
}
```

#### Secondary Button
```scss
.btn-secondary {
  background-color: transparent;
  border: 1px solid #ddd;
  color: $text-primary;
  padding: 8px 16px;
  border-radius: $border-radius-base;
  
  &:hover {
    background-color: #f8f9fa;
    border-color: #adb5bd;
  }
}
```

## Interaction Design

### Micro-Interactions

#### Search Input
- **Focus**: Border color changes to primary
- **Typing**: Real-time feedback with debouncing
- **Clear**: Smooth animation when clearing

#### Buttons
- **Hover**: Subtle color transition (200ms ease)
- **Click**: Brief scale effect (0.95 scale for 100ms)
- **Loading**: Button disabled with spinner

#### Cards
- **Hover**: Elevation increase with shadow
- **Click**: Subtle press effect

### Animation Specifications

```scss
// Transition timing
$transition-fast: 150ms ease;
$transition-base: 200ms ease;
$transition-slow: 300ms ease;

// Common transitions
.transition-all {
  transition: all $transition-base;
}

.transition-colors {
  transition: background-color $transition-fast, 
              border-color $transition-fast, 
              color $transition-fast;
}
```

### Loading Patterns

#### Progressive Loading
1. **Skeleton**: Show skeleton grid while loading
2. **Progressive**: Load and show packages as they arrive
3. **Error State**: Clear error message with retry option

#### Search Loading
1. **Debounce**: 300ms delay before search
2. **Loading Indicator**: Small spinner in search input
3. **Results**: Fade in new results

## Responsive Design

### Mobile-First Approach

#### Breakpoint Strategy
```scss
// Mobile first media queries
@mixin mobile-up {
  @media (min-width: $breakpoint-sm) { @content; }
}

@mixin tablet-up {
  @media (min-width: $breakpoint-md) { @content; }
}

@mixin desktop-up {
  @media (min-width: $breakpoint-lg) { @content; }
}
```

### Responsive Grid

#### Mobile (< 768px)
- **Columns**: 1 column
- **Spacing**: 8px gap
- **Cards**: Full width

#### Tablet (768px - 992px)
- **Columns**: 2 columns
- **Spacing**: 16px gap
- **Cards**: 50% width each

#### Desktop (> 992px)
- **Columns**: 3-4 columns (auto-fit)
- **Spacing**: 24px gap
- **Cards**: Flexible width (min 300px)

### Touch Interactions

#### Touch Targets
- **Minimum Size**: 44px x 44px
- **Spacing**: 8px minimum between targets
- **Feedback**: Visual feedback on touch

#### Gestures
- **Tap**: Primary interaction
- **Long Press**: Context menu (future enhancement)
- **Swipe**: Navigation (future enhancement)

## Accessibility Design

### Color Accessibility

#### Contrast Ratios
- **Text on Background**: 4.5:1 minimum (AA standard)
- **Large Text**: 3:1 minimum
- **Interactive Elements**: 3:1 minimum

#### Color Independence
- **Status Indicators**: Not solely dependent on color
- **Channel Badges**: Include text labels
- **Error States**: Icons and text, not just color

### Keyboard Navigation

#### Tab Order
1. Skip to main content link
2. Search input
3. Clear button
4. Grid/list items
5. Action buttons
6. Pagination controls

#### Focus Indicators
```scss
.focus-visible {
  outline: 2px solid $primary-color;
  outline-offset: 2px;
  border-radius: $border-radius-sm;
}
```

### Screen Reader Support

#### ARIA Labels
```html
<!-- Search section -->
<div role="search" aria-label="Package search">
  <input aria-label="Search packages" />
  <button aria-label="Clear search">Clear</button>
</div>

<!-- Grid -->
<div role="grid" aria-label="Package results">
  <div role="row">
    <div role="gridcell">Package name</div>
    <div role="gridcell">Version</div>
    <!-- ... -->
  </div>
</div>
```

## Performance Considerations

### Optimization Strategies

#### Image Optimization
- **Format**: WebP with PNG fallback
- **Sizing**: Responsive images with srcset
- **Loading**: Lazy loading for below-fold content

#### CSS Optimization
- **Critical CSS**: Inline critical path CSS
- **Bundle Splitting**: Separate vendor and app CSS
- **Minification**: Production CSS minification

#### Animation Performance
- **Transform/Opacity**: Use only transform and opacity for animations
- **will-change**: Apply strategically for performance
- **Reduce Motion**: Respect prefers-reduced-motion

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Current Implementation: Simplified Official Design

### Design Update (Latest)

The current implementation has been updated to closely match the official Chef Habitat Builder package list page design. This simplified approach emphasizes:

#### Key Design Changes
1. **Simplified Layout**: Removed complex grid in favor of a simple list
2. **Minimal Package Display**: Shows only `origin/name` format as clickable links
3. **Clean Search**: Simple search input without excessive styling
4. **Reduced Visual Complexity**: Eliminated version info, badges, and action buttons in the main list
5. **Official Aesthetic**: Matches the visual design of the actual Habitat Builder

#### Current Layout Structure

##### Header
```html
<div class="header-section">
  <h1 class="page-title">Search Packages</h1>
  <p class="page-subtitle">Search Results</p>
</div>
```

##### Search
```html
<div class="search-section">
  <kendo-textbox
    [formControl]="searchControl"
    placeholder="Search Packages..."
    [clearButton]="true"
    (valueChange)="onSearch()"
    class="search-input">
  </kendo-textbox>
</div>
```

##### Package List
```html
<div class="simple-packages-list">
  <div class="simple-package-item" *ngFor="let package of packages">
    <a (click)="viewPackage(package)" class="simple-package-link">
      {{ package.origin }}/{{ package.name }}
    </a>
  </div>
</div>
```

#### Visual Design Updates

##### Colors (Simplified)
- **Background**: `#fff` (white)
- **Primary Text**: `#333` (dark gray)  
- **Links**: `#2563eb` (blue) with hover: `#1d4ed8`
- **Borders**: `#e5e7eb` (light gray)
- **Error Background**: `#fef2f2` with border `#fecaca`

##### Typography (Streamlined)
- **Page Title**: 2rem, weight 600
- **Subtitle**: 1rem, normal weight
- **Package Links**: 0.9rem, normal weight
- **System Font**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

##### Spacing (Consistent)
- **Section Spacing**: 24px between major sections
- **List Item Padding**: 12px vertical, 16px horizontal
- **Container**: Max-width 1200px, centered with 20px padding

#### Responsive Behavior

##### Mobile (< 768px)
- Container padding reduced to 16px
- Page title scales to 1.5rem
- Search input becomes full width
- Package links have smaller padding (10px/12px)

##### Desktop
- Search input max-width: 400px
- Container max-width: 1200px
- Optimal spacing maintained

#### Interaction States

##### Package Links
```scss
.simple-package-link {
  display: block;
  padding: 12px 16px;
  color: #2563eb;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
    color: #1d4ed8;
    cursor: pointer;
  }
  
  &:active {
    background-color: #e5e7eb;
  }
}
```

##### List Container
```scss
.simple-packages-list {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  
  .simple-package-item {
    border-bottom: 1px solid #e5e7eb;
    
    &:last-child {
      border-bottom: none;
    }
  }
}
```

This simplified design provides:
- **Better Performance**: Lighter DOM structure
- **Enhanced Accessibility**: Simpler navigation and screen reader compatibility  
- **Authentic Look**: Matches the official Habitat Builder aesthetic
- **Improved Usability**: Cleaner, more focused user experience
- **Mobile Optimization**: Better responsive behavior on small screens

This UI/UX specification provides a comprehensive guide for implementing a modern, accessible, and user-friendly interface for the Chef Habitat Package Explorer.
