import * as HabitatSelectors from './habitat.selectors';
import { HabitatState } from './habitat.models';

describe('Habitat Selectors', () => {
  const mockState: { habitat: HabitatState } = {
    habitat: {
      packages: [
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
      ],
      loading: true,
      error: 'Test error',
      totalCount: 20,
      currentPage: 1,
      pageSize: 10,
      searchQuery: 'nginx'
    }
  };

  describe('selectPackages', () => {
    it('should select packages from state', () => {
      const result = HabitatSelectors.selectPackages(mockState);
      expect(result).toEqual(mockState.habitat.packages);
      expect(result.length).toBe(2);
    });
  });

  describe('selectLoading', () => {
    it('should select loading from state', () => {
      const result = HabitatSelectors.selectLoading(mockState);
      expect(result).toBe(true);
    });
  });

  describe('selectError', () => {
    it('should select error from state', () => {
      const result = HabitatSelectors.selectError(mockState);
      expect(result).toBe('Test error');
    });
  });

  describe('selectTotalCount', () => {
    it('should select totalCount from state', () => {
      const result = HabitatSelectors.selectTotalCount(mockState);
      expect(result).toBe(20);
    });
  });

  describe('selectCurrentPage', () => {
    it('should select currentPage from state', () => {
      const result = HabitatSelectors.selectCurrentPage(mockState);
      expect(result).toBe(1);
    });
  });

  describe('selectSearchQuery', () => {
    it('should select searchQuery from state', () => {
      const result = HabitatSelectors.selectSearchQuery(mockState);
      expect(result).toBe('nginx');
    });
  });

  describe('selectHasMorePackages', () => {
    it('should return true when there are more packages available', () => {
      const result = HabitatSelectors.selectHasMorePackages(mockState);
      // With 2 packages loaded, page 1, pageSize 10, and totalCount 20, there should be more
      expect(result).toBe(true);
    });

    it('should return false when all packages are loaded', () => {
      const stateAllLoaded = {
        ...mockState,
        habitat: {
          ...mockState.habitat,
          packages: new Array(20).fill(mockState.habitat.packages[0]), // 20 packages
          totalCount: 20
        }
      };
      const result = HabitatSelectors.selectHasMorePackages(stateAllLoaded);
      expect(result).toBe(false);
    });

    it('should return false when no packages exist', () => {
      const emptyState = {
        ...mockState,
        habitat: {
          ...mockState.habitat,
          packages: [],
          totalCount: 0
        }
      };
      const result = HabitatSelectors.selectHasMorePackages(emptyState);
      expect(result).toBe(false);
    });
  });

  describe('with empty state', () => {
    const emptyState: { habitat: HabitatState } = {
      habitat: {
        packages: [],
        loading: false,
        error: null,
        totalCount: 0,
        currentPage: 0,
        pageSize: 50,
        searchQuery: ''
      }
    };

    it('should select empty packages array', () => {
      const result = HabitatSelectors.selectPackages(emptyState);
      expect(result).toEqual([]);
    });

    it('should select false loading', () => {
      const result = HabitatSelectors.selectLoading(emptyState);
      expect(result).toBe(false);
    });

    it('should select null error', () => {
      const result = HabitatSelectors.selectError(emptyState);
      expect(result).toBe(null);
    });

    it('should select zero totalCount', () => {
      const result = HabitatSelectors.selectTotalCount(emptyState);
      expect(result).toBe(0);
    });

    it('should select zero currentPage', () => {
      const result = HabitatSelectors.selectCurrentPage(emptyState);
      expect(result).toBe(0);
    });

    it('should select empty searchQuery', () => {
      const result = HabitatSelectors.selectSearchQuery(emptyState);
      expect(result).toBe('');
    });

    it('should select false hasMorePackages', () => {
      const result = HabitatSelectors.selectHasMorePackages(emptyState);
      expect(result).toBe(false);
    });
  });
});
