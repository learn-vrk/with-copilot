import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HabitatPackage } from '../store/habitat/habitat.models';
import * as HabitatActions from '../store/habitat/habitat.actions';
import * as HabitatSelectors from '../store/habitat/habitat.selectors';

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
  
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.packages$ = this.store.select(HabitatSelectors.selectPackages);
    this.loading$ = this.store.select(HabitatSelectors.selectLoading);
    this.error$ = this.store.select(HabitatSelectors.selectError);
    this.totalCount$ = this.store.select(HabitatSelectors.selectTotalCount);
    this.hasMorePackages$ = this.store.select(HabitatSelectors.selectHasMorePackages);
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
}
