import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { HabitatPackage } from '../store/habitat/habitat.models';
import * as HabitatActions from '../store/habitat/habitat.actions';
import * as HabitatSelectors from '../store/habitat/habitat.selectors';

/**
 * @fileoverview Component for displaying and managing Chef Habitat packages
 * using Kendo Angular UI components with NgRX state management.
 * 
 * This component provides:
 * - A searchable, paginated grid of Habitat packages
 * - Package details viewing and install command copying
 * - Real-time search with debouncing
 * - Loading states and error handling
 * - Modern UI using Kendo Angular components
 * 
 * @author Angular Development Team
 * @since 1.0.0
 */

/**
 * Component for displaying Chef Habitat packages in a modern, searchable grid interface.
 * 
 * Features:
 * - Kendo Angular Grid with pagination, sorting, and filtering
 * - Real-time search with 300ms debouncing
 * - Package installation command copying
 * - Direct links to package details on Habitat Builder
 * - Responsive design with loading and error states
 * - NgRX integration for state management
 * 
 * @example
 * ```html
 * <app-habitat-packages></app-habitat-packages>
 * ```
 */
@Component({
  selector: 'app-habitat-packages',
  templateUrl: './habitat-packages.component.html',
  styleUrls: ['./habitat-packages.component.scss']
})
export class HabitatPackagesComponent implements OnInit, OnDestroy {
  packages$: Observable<HabitatPackage[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalCount$: Observable<number>;
  hasMorePackages$: Observable<boolean>;
  
  // Kendo Grid properties
  gridData$: Observable<GridDataResult>;
  state: State = {
    skip: 0,
    take: 10
  };
  
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.packages$ = this.store.select(HabitatSelectors.selectPackages);
    this.loading$ = this.store.select(HabitatSelectors.selectLoading);
    this.error$ = this.store.select(HabitatSelectors.selectError);
    this.totalCount$ = this.store.select(HabitatSelectors.selectTotalCount);
    this.hasMorePackages$ = this.store.select(HabitatSelectors.selectHasMorePackages);
    
    // Create grid data observable
    this.gridData$ = combineLatest([
      this.packages$,
      this.totalCount$
    ]).pipe(
      map(([packages, total]) => ({
        data: packages || [],
        total: total || 0
      }))
    );
  }

  ngOnInit(): void {
    // Load initial packages
    this.store.dispatch(HabitatActions.loadPackages({ page: 0 }));

    // Set up search functionality
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        if (query !== null) {
          this.store.dispatch(HabitatActions.searchPackages({ query }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMorePackages(): void {
    this.store.dispatch(HabitatActions.loadMorePackages());
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.store.dispatch(HabitatActions.clearPackages());
    this.store.dispatch(HabitatActions.loadPackages({ page: 0 }));
  }

  getChannelBadgeClass(channel: string): string {
    switch (channel.toLowerCase()) {
      case 'stable':
        return 'badge-success';
      case 'unstable':
        return 'badge-warning';
      case 'lts-2024':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }

  trackByPackage(index: number, pkg: HabitatPackage): string {
    return `${pkg.origin}/${pkg.name}/${pkg.version}/${pkg.release}`;
  }

  viewPackage(pkg: HabitatPackage): void {
    // Open package details in new tab
    const url = `https://bldr.habitat.sh/#/pkgs/${pkg.origin}/${pkg.name}/${pkg.version}/${pkg.release}`;
    window.open(url, '_blank');
  }

  copyInstallCommand(pkg: HabitatPackage): void {
    const command = `hab pkg install ${pkg.origin}/${pkg.name}/${pkg.version}/${pkg.release}`;
    navigator.clipboard.writeText(command).then(() => {
      // You could add a toast notification here
      console.log('Install command copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy command: ', err);
    });
  }

  tryRealAPI(): void {
    // Attempt to use the real Habitat API (will likely fail due to CORS)
    this.store.dispatch(HabitatActions.clearPackages());
    // This would need to be implemented in the service and effects
    console.log('Real API call would be made here, but CORS prevents it');
  }

  onDataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    // Handle pagination, sorting, filtering through NgRX if needed
    const page = Math.floor(state.skip! / state.take!);
    this.store.dispatch(HabitatActions.loadPackages({ page }));
  }

  onSearch(): void {
    const query = this.searchControl.value;
    if (query) {
      this.store.dispatch(HabitatActions.searchPackages({ query }));
    } else {
      this.store.dispatch(HabitatActions.clearPackages());
      this.store.dispatch(HabitatActions.loadPackages({ page: 0 }));
    }
  }
}
