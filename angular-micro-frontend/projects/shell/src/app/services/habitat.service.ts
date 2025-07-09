/**
 * @fileoverview Service for handling Chef Habitat package API operations.
 * 
 * This service provides methods to fetch package data from the Chef Habitat
 * Builder API, with fallback to mock data for demo purposes due to CORS restrictions.
 * 
 * @author Angular Development Team
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { HabitatPackageResponse, HabitatPackage } from '../store/habitat/habitat.models';

/**
 * Service for interacting with Chef Habitat package data.
 * 
 * This service provides methods to fetch package information from the Chef Habitat
 * Builder API. Currently uses mock data for demonstration purposes due to CORS
 * restrictions when calling the real API from a browser environment.
 * 
 * @example
 * ```typescript
 * constructor(private habitatService: HabitatService) {}
 * 
 * loadPackages() {
 *   this.habitatService.getPackages(0, 'nginx').subscribe(response => {
 *     console.log('Packages:', response.data);
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class HabitatService {
  /** Base URL for the Chef Habitat Builder API */
  private apiUrl = 'https://bldr.habitat.sh/v1/depot/pkgs/core';

  constructor(private http: HttpClient) {}

  /**
   * Fetches packages from the Chef Habitat Builder API or mock data.
   * 
   * Currently returns mock data due to CORS restrictions. In a production
   * environment, this would make actual HTTP requests to the Habitat API
   * through a backend proxy.
   * 
   * @param page - Zero-based page number for pagination
   * @param searchQuery - Optional search query to filter packages
   * @returns Observable containing the package response data
   * 
   * @example
   * ```typescript
   * // Load first page of all packages
   * this.habitatService.getPackages(0).subscribe(response => {
   *   console.log('Total packages:', response.total_count);
   *   console.log('Packages:', response.data);
   * });
   * 
   * // Search for nginx packages
   * this.habitatService.getPackages(0, 'nginx').subscribe(response => {
   *   console.log('Nginx packages:', response.data);
   * });
   * ```
   */
  getPackages(page: number = 0, searchQuery?: string): Observable<HabitatPackageResponse> {
    // For demo purposes, we'll use mock data due to CORS restrictions
    // In a real application, you would need a backend proxy or CORS-enabled API
    return this.getMockPackages(page, searchQuery);
  }

  /**
   * Provides mock package data for demonstration purposes.
   * 
   * This method simulates the Chef Habitat Builder API response with a
   * comprehensive set of mock packages including popular tools and services.
   * Supports pagination and search functionality.
   * 
   * @param page - Zero-based page number for pagination
   * @param searchQuery - Optional search query to filter packages by name
   * @returns Observable containing mock package response data
   * 
   * @private
   * @example
   * ```typescript
   * // This is called internally by getPackages()
   * this.getMockPackages(0, 'nginx').subscribe(response => {
   *   console.log('Mock nginx packages:', response.data);
   * });
   * ```
   */
  private getMockPackages(page: number = 0, searchQuery?: string): Observable<HabitatPackageResponse> {
    /** 
     * Mock data representing typical Chef Habitat packages.
     * Each package includes origin, name, version, release, channels, and platforms.
     */
    const allPackages: HabitatPackage[] = [
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
      },
      {
        origin: 'core',
        name: 'postgresql',
        version: '14.7',
        release: '20240220100000',
        channels: ['stable', 'LTS-2024'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'node',
        version: '18.19.0',
        release: '20240305160000',
        channels: ['stable', 'unstable'],
        platforms: ['x86_64-linux', 'x86_64-windows', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'python',
        version: '3.11.7',
        release: '20240310080000',
        channels: ['stable', 'LTS-2024'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'docker',
        version: '24.0.7',
        release: '20240312120000',
        channels: ['stable', 'unstable'],
        platforms: ['x86_64-linux']
      },
      {
        origin: 'core',
        name: 'mongodb',
        version: '6.0.13',
        release: '20240318090000',
        channels: ['stable'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'elasticsearch',
        version: '8.12.0',
        release: '20240320150000',
        channels: ['stable', 'unstable'],
        platforms: ['x86_64-linux']
      },
      {
        origin: 'core',
        name: 'mysql',
        version: '8.0.36',
        release: '20240325110000',
        channels: ['stable', 'LTS-2024'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'apache2',
        version: '2.4.58',
        release: '20240328130000',
        channels: ['stable'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'vault',
        version: '1.15.6',
        release: '20240402170000',
        channels: ['stable', 'unstable'],
        platforms: ['x86_64-linux', 'x86_64-windows', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'consul',
        version: '1.17.2',
        release: '20240405140000',
        channels: ['stable', 'unstable'],
        platforms: ['x86_64-linux', 'x86_64-windows', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'kafka',
        version: '2.8.2',
        release: '20240408100000',
        channels: ['stable'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'jenkins',
        version: '2.440.1',
        release: '20240410180000',
        channels: ['stable', 'LTS-2024'],
        platforms: ['x86_64-linux']
      },
      {
        origin: 'core',
        name: 'grafana',
        version: '10.3.5',
        release: '20240412160000',
        channels: ['stable', 'unstable'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'prometheus',
        version: '2.50.1',
        release: '20240415130000',
        channels: ['stable', 'unstable'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'rabbitmq',
        version: '3.12.12',
        release: '20240418110000',
        channels: ['stable'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'haproxy',
        version: '2.9.6',
        release: '20240420150000',
        channels: ['stable', 'LTS-2024'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'memcached',
        version: '1.6.23',
        release: '20240422090000',
        channels: ['stable'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      },
      {
        origin: 'core',
        name: 'etcd',
        version: '3.5.12',
        release: '20240425140000',
        channels: ['stable', 'unstable'],
        platforms: ['x86_64-linux', 'aarch64-linux']
      }
    ];

    // Filter packages based on search query if provided
    let filteredPackages = allPackages;
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredPackages = allPackages.filter(pkg => 
        pkg.name.toLowerCase().includes(query) ||
        pkg.origin.toLowerCase().includes(query)
      );
    }

    // Implement pagination with configurable page size
    const pageSize = 10;
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredPackages.length);
    const paginatedPackages = filteredPackages.slice(startIndex, endIndex);

    // Create response object matching Habitat API structure
    const response: HabitatPackageResponse = {
      range_start: startIndex,
      range_end: endIndex - 1,
      total_count: filteredPackages.length,
      data: paginatedPackages
    };

    // Simulate network delay for realistic UX
    return of(response).pipe(delay(500));
  }

  /**
   * Alternative method to call the real Chef Habitat Builder API.
   * 
   * This method demonstrates how to make actual HTTP requests to the Habitat API.
   * It will likely fail in browser environments due to CORS restrictions unless
   * the API is accessed through a backend proxy.
   * 
   * @param page - Zero-based page number for pagination
   * @param searchQuery - Optional search query to filter packages
   * @returns Observable containing the real API response
   * 
   * @example
   * ```typescript
   * // Attempt to call real API (may fail due to CORS)
   * this.habitatService.tryRealAPI(0, 'nginx').subscribe({
   *   next: response => console.log('Real API response:', response),
   *   error: err => console.error('CORS error:', err)
   * });
   * ```
   * 
   * @see {@link https://bldr.habitat.sh/} Chef Habitat Builder
   */
  tryRealAPI(page: number = 0, searchQuery?: string): Observable<HabitatPackageResponse> {
    const params = new URLSearchParams();
    
    if (page > 0) {
      params.append('range', `${page * 50}-${(page + 1) * 50 - 1}`);
    }
    
    if (searchQuery) {
      params.append('q', searchQuery);
    }
    
    const url = `${this.apiUrl}?${params.toString()}`;
    return this.http.get<HabitatPackageResponse>(url);
  }
}
