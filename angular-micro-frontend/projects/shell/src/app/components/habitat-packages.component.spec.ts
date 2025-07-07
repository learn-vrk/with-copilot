import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HabitatPackagesComponent } from './habitat-packages.component';
import { HabitatPackage } from '../store/habitat/habitat.models';
import * as HabitatActions from '../store/habitat/habitat.actions';
import * as HabitatSelectors from '../store/habitat/habitat.selectors';

describe('HabitatPackagesComponent', () => {
  let component: HabitatPackagesComponent;
  let fixture: ComponentFixture<HabitatPackagesComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  const mockPackages: HabitatPackage[] = [
    {
      origin: 'core',
      name: 'nginx',
      version: '1.21.6',
      release: '20240301120000',
      channels: ['stable', 'LTS-2024'],
      platforms: ['x86_64-linux', 'aarch64-linux']
    },
    {
      origin: 'core',
      name: 'redis',
      version: '7.0.8',
      release: '20240215140000',
      channels: ['stable', 'unstable'],
      platforms: ['x86_64-linux']
    }
  ];

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    // Setup store selectors first, before TestBed configuration
    storeSpy.select.and.callFake((selector: any) => {
      if (selector === HabitatSelectors.selectPackages) {
        return of(mockPackages);
      } else if (selector === HabitatSelectors.selectLoading) {
        return of(false);
      } else if (selector === HabitatSelectors.selectError) {
        return of(null);
      } else if (selector === HabitatSelectors.selectTotalCount) {
        return of(20);
      } else if (selector === HabitatSelectors.selectHasMorePackages) {
        return of(true);
      }
      return of(null);
    });

    await TestBed.configureTestingModule({
      declarations: [HabitatPackagesComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: storeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitatPackagesComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    
    fixture.detectChanges(); // Trigger ngOnInit
  });

  beforeEach(() => {
    // Reset spies before each test
    mockStore.dispatch.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables from store', () => {
    expect(component.packages$).toBeDefined();
    expect(component.loading$).toBeDefined();
    expect(component.error$).toBeDefined();
    expect(component.totalCount$).toBeDefined();
    expect(component.hasMorePackages$).toBeDefined();
  });

  it('should dispatch loadPackages action on ngOnInit', () => {
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      HabitatActions.loadPackages({ page: 0 })
    );
  });

  it('should setup search control with debounce', () => {
    expect(component.searchControl).toBeDefined();
    expect(component.searchControl.value).toBe('');
  });

  it('should dispatch searchPackages action when search value changes', (done) => {
    component.ngOnInit();
    
    const searchQuery = 'nginx';
    component.searchControl.setValue(searchQuery);
    
    // Wait for debounce time
    setTimeout(() => {
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        HabitatActions.searchPackages({ query: searchQuery })
      );
      done();
    }, 350);
  });

  it('should dispatch loadMorePackages action when loadMorePackages is called', () => {
    component.loadMorePackages();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      HabitatActions.loadMorePackages()
    );
  });

  it('should clear search and reload packages when clearSearch is called', () => {
    component.searchControl.setValue('test');
    component.clearSearch();
    
    expect(component.searchControl.value).toBe('');
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      HabitatActions.clearPackages()
    );
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      HabitatActions.loadPackages({ page: 0 })
    );
  });

  it('should return correct badge class for channels', () => {
    expect(component.getChannelBadgeClass('stable')).toBe('badge-success');
    expect(component.getChannelBadgeClass('unstable')).toBe('badge-warning');
    expect(component.getChannelBadgeClass('lts-2024')).toBe('badge-info');
    expect(component.getChannelBadgeClass('other')).toBe('badge-secondary');
  });

  it('should generate correct tracking identifier', () => {
    const pkg = mockPackages[0];
    const trackingId = component.trackByPackage(0, pkg);
    expect(trackingId).toBe('core/nginx/1.21.6/20240301120000');
  });

  it('should open package details in new tab', () => {
    spyOn(window, 'open');
    const pkg = mockPackages[0];
    
    component.viewPackage(pkg);
    
    expect(window.open).toHaveBeenCalledWith(
      'https://bldr.habitat.sh/#/pkgs/core/nginx/1.21.6/20240301120000',
      '_blank'
    );
  });

  it('should copy install command to clipboard', async () => {
    const writeTextSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const pkg = mockPackages[0];
    
    component.copyInstallCommand(pkg);
    
    expect(writeTextSpy).toHaveBeenCalledWith(
      'hab pkg install core/nginx/1.21.6/20240301120000'
    );
  });

  it('should handle clipboard copy failure gracefully', (done) => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.reject('Copy failed'));
    spyOn(console, 'error');
    const pkg = mockPackages[0];
    
    component.copyInstallCommand(pkg);
    
    setTimeout(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to copy command: ', 'Copy failed');
      done();
    }, 100);
  });

  it('should cleanup subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should not dispatch search when search value is null', (done) => {
    component.ngOnInit();
    mockStore.dispatch.calls.reset();
    
    component.searchControl.setValue(null);
    
    // Wait for debounce time
    setTimeout(() => {
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: jasmine.stringContaining('searchPackages')
        })
      );
      done();
    }, 350);
  });

  it('should log message when trying real API', () => {
    spyOn(console, 'log');
    
    component.tryRealAPI();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      HabitatActions.clearPackages()
    );
    expect(console.log).toHaveBeenCalledWith(
      'Real API call would be made here, but CORS prevents it'
    );
  });
});
