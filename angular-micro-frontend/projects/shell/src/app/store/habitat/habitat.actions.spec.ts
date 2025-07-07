import * as HabitatActions from './habitat.actions';
import { HabitatPackageResponse } from './habitat.models';

describe('Habitat Actions', () => {
  const mockResponse: HabitatPackageResponse = {
    data: [
      {
        origin: 'core',
        name: 'nginx',
        version: '1.21.6',
        release: '20240301120000',
        channels: ['stable'],
        platforms: ['x86_64-linux']
      }
    ],
    range_start: 0,
    range_end: 0,
    total_count: 1
  };

  describe('loadPackages', () => {
    it('should create loadPackages action without parameters', () => {
      const action = HabitatActions.loadPackages({ page: 0 });
      expect(action).toEqual({
        type: '[Habitat] Load Packages',
        page: 0
      });
    });

    it('should create loadPackages action with page and search query', () => {
      const action = HabitatActions.loadPackages({ 
        page: 1, 
        searchQuery: 'nginx' 
      });
      expect(action).toEqual({
        type: '[Habitat] Load Packages',
        page: 1,
        searchQuery: 'nginx'
      });
    });
  });

  describe('loadPackagesSuccess', () => {
    it('should create loadPackagesSuccess action with response', () => {
      const action = HabitatActions.loadPackagesSuccess({ 
        response: mockResponse 
      });
      expect(action).toEqual({
        type: '[Habitat] Load Packages Success',
        response: mockResponse
      });
    });
  });

  describe('loadPackagesFailure', () => {
    it('should create loadPackagesFailure action with error', () => {
      const error = 'Failed to load packages';
      const action = HabitatActions.loadPackagesFailure({ error });
      expect(action).toEqual({
        type: '[Habitat] Load Packages Failure',
        error
      });
    });
  });

  describe('loadMorePackages', () => {
    it('should create loadMorePackages action', () => {
      const action = HabitatActions.loadMorePackages();
      expect(action).toEqual({
        type: '[Habitat] Load More Packages'
      });
    });
  });

  describe('searchPackages', () => {
    it('should create searchPackages action with query', () => {
      const query = 'nginx';
      const action = HabitatActions.searchPackages({ query });
      expect(action).toEqual({
        type: '[Habitat] Search Packages',
        query
      });
    });

    it('should create searchPackages action with empty query', () => {
      const query = '';
      const action = HabitatActions.searchPackages({ query });
      expect(action).toEqual({
        type: '[Habitat] Search Packages',
        query
      });
    });
  });

  describe('clearPackages', () => {
    it('should create clearPackages action', () => {
      const action = HabitatActions.clearPackages();
      expect(action).toEqual({
        type: '[Habitat] Clear Packages'
      });
    });
  });
});
