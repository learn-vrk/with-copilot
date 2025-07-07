import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HabitatService } from './habitat.service';
import { HabitatPackageResponse } from '../store/habitat/habitat.models';

describe('HabitatService', () => {
  let service: HabitatService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        HabitatService,
        { provide: HttpClient, useValue: spy }
      ]
    });

    service = TestBed.inject(HabitatService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return mock packages data', (done) => {
    service.getPackages().subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.data).toBeDefined();
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.total_count).toBeDefined();
      expect(response.range_start).toBeDefined();
      expect(response.range_end).toBeDefined();
      done();
    });
  });

  it('should return paginated results', (done) => {
    const page = 1;
    service.getPackages(page).subscribe(response => {
      expect(response.range_start).toBe(page * 10);
      done();
    });
  });

  it('should filter packages by search query', (done) => {
    const searchQuery = 'nginx';
    service.getPackages(0, searchQuery).subscribe(response => {
      expect(response.data.length).toBeGreaterThan(0);
      // Check that all returned packages contain the search query
      response.data.forEach(pkg => {
        expect(
          pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.origin.toLowerCase().includes(searchQuery.toLowerCase())
        ).toBe(true);
      });
      done();
    });
  });

  it('should return empty results for non-matching search query', (done) => {
    const searchQuery = 'nonexistentpackage';
    service.getPackages(0, searchQuery).subscribe(response => {
      expect(response.data.length).toBe(0);
      expect(response.total_count).toBe(0);
      done();
    });
  });

  it('should return results with proper structure', (done) => {
    service.getPackages().subscribe(response => {
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data.length > 0) {
        const firstPackage = response.data[0];
        expect(firstPackage.name).toBeDefined();
        expect(firstPackage.origin).toBeDefined();
        expect(firstPackage.version).toBeDefined();
        expect(firstPackage.release).toBeDefined();
        expect(firstPackage.channels).toBeDefined();
        expect(firstPackage.platforms).toBeDefined();
        expect(Array.isArray(firstPackage.channels)).toBe(true);
        expect(Array.isArray(firstPackage.platforms)).toBe(true);
      }
      done();
    });
  });

  it('should simulate network delay', (done) => {
    const startTime = Date.now();
    service.getPackages().subscribe(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(300); // At least 300ms delay
      done();
    });
  });

  it('should handle pagination correctly', (done) => {
    const page = 2;
    const pageSize = 10;
    service.getPackages(page).subscribe(response => {
      expect(response.range_start).toBe(page * pageSize);
      expect(response.range_end).toBeLessThanOrEqual(response.total_count - 1);
      done();
    });
  });

  it('should return case-insensitive search results', (done) => {
    const searchQuery = 'NGINX';
    service.getPackages(0, searchQuery).subscribe(response => {
      expect(response.data.length).toBeGreaterThan(0);
      response.data.forEach(pkg => {
        expect(
          pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.origin.toLowerCase().includes(searchQuery.toLowerCase())
        ).toBe(true);
      });
      done();
    });
  });
});
