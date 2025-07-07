import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import * as AppActions from './store/app.actions';
import * as AppSelectors from './store/app.selectors';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let router: Router;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    // Setup store selectors first, before TestBed configuration
    storeSpy.select.and.callFake((selector: any) => {
      if (selector === AppSelectors.selectMessage) {
        return of('Test message');
      } else if (selector === AppSelectors.selectLoading) {
        return of(false);
      } else if (selector === AppSelectors.selectError) {
        return of(null);
      }
      return of('test');
    });

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: Store, useValue: storeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('Shell Application');
  });

  it('should initialize observables from store', () => {
    expect(component.message$).toBeDefined();
    expect(component.loading$).toBeDefined();
    expect(component.error$).toBeDefined();
  });

  it('should dispatch loadMessage action on ngOnInit', () => {
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(AppActions.loadMessage());
  });

  it('should dispatch updateMessage action when updateMessage is called', () => {
    const testMessage = 'Test message';
    component.updateMessage(testMessage);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AppActions.updateMessage({ message: testMessage })
    );
  });

  it('should dispatch loadMessage action when loadMessage is called', () => {
    component.loadMessage();
    expect(mockStore.dispatch).toHaveBeenCalledWith(AppActions.loadMessage());
  });

  it('should return true for isHomePage when router url is /', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/');
    expect(component.isHomePage()).toBe(true);
  });

  it('should return false for isHomePage when router url is not /', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/packages');
    expect(component.isHomePage()).toBe(false);
  });

  it('should select correct store selectors', () => {
    fixture.detectChanges();
    expect(mockStore.select).toHaveBeenCalledTimes(3);
  });
});
