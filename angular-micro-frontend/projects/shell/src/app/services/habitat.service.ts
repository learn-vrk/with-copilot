import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { HabitatPackageResponse, HabitatPackage } from '../store/habitat/habitat.models';

@Injectable({
  providedIn: 'root'
})
export class HabitatService {
  private apiUrl = 'https://bldr.habitat.sh/v1/depot/pkgs/core';

  constructor(private http: HttpClient) {}

  getPackages(page: number = 0, searchQuery?: string): Observable<HabitatPackageResponse> {
    // For demo purposes, we'll use mock data due to CORS restrictions
    // In a real application, you would need a backend proxy or CORS-enabled API
    return this.getMockPackages(page, searchQuery);
  }

  private getMockPackages(page: number = 0, searchQuery?: string): Observable<HabitatPackageResponse> {
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

    // Filter packages based on search query
    let filteredPackages = allPackages;
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredPackages = allPackages.filter(pkg => 
        pkg.name.toLowerCase().includes(query) ||
        pkg.origin.toLowerCase().includes(query)
      );
    }

    // Simulate pagination
    const pageSize = 10;
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredPackages.length);
    const paginatedPackages = filteredPackages.slice(startIndex, endIndex);

    const response: HabitatPackageResponse = {
      range_start: startIndex,
      range_end: endIndex - 1,
      total_count: filteredPackages.length,
      data: paginatedPackages
    };

    // Simulate network delay
    return of(response).pipe(delay(500));
  }

  // Alternative method to try the real API (will likely fail due to CORS)
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
