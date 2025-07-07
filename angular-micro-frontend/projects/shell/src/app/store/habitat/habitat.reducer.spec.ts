import { habitatReducer, initialState } from './habitat.reducer';
import * as HabitatActions from './habitat.actions';
import { HabitatPackage, HabitatPackageResponse } from './habitat.models';

describe('Habitat Reducer', () => {
  const mockPackages: HabitatPackage[] = [
    {
      origin: 'core',
      name: 'nginx',
      version: '1.21.6',
      release: '20240301120000',
      channels: ['stable'],
      platforms: ['x86_64-linux']
    },
    {
      origin: 'core',
      name: 'redis',
      version: '7.0.8',
      release: '20240215140000',
      channels: ['stable'],
      platforms: ['x86_64-linux']
    }
  ];

  const mockResponse: HabitatPackageResponse = {
    data: mockPackages,
    range_start: 0,
    range_end: 1,
    total_count: 2
  };

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = habitatReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('loadPackages action', () => {
    it('should set loading to true and clear error', () => {
      const action = HabitatActions.loadPackages({ page: 0 });
      const result = habitatReducer(initialState, action);
      
      expect(result.loading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should preserve existing packages when loading more', () => {
      const previousState = {
        ...initialState,
        packages: [mockPackages[0]]
      };
      const action = HabitatActions.loadPackages({ page: 1 });
      const result = habitatReducer(previousState, action);
      
      expect(result.loading).toBe(true);
      expect(result.packages).toEqual([mockPackages[0]]);
    });
  });

  describe('loadPackagesSuccess action', () => {
    it('should set packages and update pagination info', () => {
      const action = HabitatActions.loadPackagesSuccess({ response: mockResponse });
      const result = habitatReducer(initialState, action);
      
      expect(result.packages).toEqual(mockPackages);
      expect(result.loading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.totalCount).toBe(2);
      expect(result.currentPage).toBe(0);
    });

    it('should append packages when loading more pages', () => {
      const previousState = {
        ...initialState,
        packages: [mockPackages[0]],
        currentPage: 1 // Set currentPage to 1 to trigger append logic
      };
      const newResponse: HabitatPackageResponse = {
        data: [mockPackages[1]],
        range_start: 1,
        range_end: 1,
        total_count: 2
      };
      const action = HabitatActions.loadPackagesSuccess({ response: newResponse });
      const result = habitatReducer(previousState, action);
      
      expect(result.packages).toEqual(mockPackages);
      expect(result.currentPage).toBe(1); // currentPage is not updated in success action
    });

    it('should replace packages when starting new search', () => {
      const responseWithMore: HabitatPackageResponse = {
        data: mockPackages,
        range_start: 0,
        range_end: 1,
        total_count: 10
      };
      const action = HabitatActions.loadPackagesSuccess({ response: responseWithMore });
      const result = habitatReducer(initialState, action);
      
      expect(result.totalCount).toBe(10);
      expect(result.packages.length).toBe(2);
    });
  });

  describe('loadPackagesFailure action', () => {
    it('should set error and stop loading', () => {
      const error = 'Failed to load packages';
      const action = HabitatActions.loadPackagesFailure({ error });
      const previousState = {
        ...initialState,
        loading: true
      };
      
      const result = habitatReducer(previousState, action);
      
      expect(result.error).toBe(error);
      expect(result.loading).toBe(false);
    });
  });

  describe('loadMorePackages action', () => {
    it('should increment current page', () => {
      const previousState = {
        ...initialState,
        currentPage: 0
      };
      const action = HabitatActions.loadMorePackages();
      const result = habitatReducer(previousState, action);
      
      expect(result.currentPage).toBe(1);
    });
  });

  describe('searchPackages action', () => {
    it('should set search query and reset pagination', () => {
      const query = 'nginx';
      const previousState = {
        ...initialState,
        currentPage: 2,
        packages: mockPackages
      };
      const action = HabitatActions.searchPackages({ query });
      const result = habitatReducer(previousState, action);
      
      expect(result.searchQuery).toBe(query);
      expect(result.currentPage).toBe(0);
      expect(result.packages).toEqual([]);
    });
  });

  describe('clearPackages action', () => {
    it('should reset all packages and pagination', () => {
      const previousState = {
        ...initialState,
        packages: mockPackages,
        currentPage: 2,
        searchQuery: 'nginx',
        totalCount: 10
      };
      const action = HabitatActions.clearPackages();
      const result = habitatReducer(previousState, action);
      
      expect(result.packages).toEqual([]);
      expect(result.currentPage).toBe(0);
      expect(result.searchQuery).toBe('');
      expect(result.totalCount).toBe(0);
    });
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      expect(initialState.packages).toEqual([]);
      expect(initialState.loading).toBe(false);
      expect(initialState.error).toBe(null);
      expect(initialState.currentPage).toBe(0);
      expect(initialState.searchQuery).toBe('');
      expect(initialState.totalCount).toBe(0);
      expect(initialState.pageSize).toBe(50);
    });
  });
});
