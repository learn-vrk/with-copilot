import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HabitatPackageResponse } from '../store/habitat/habitat.models';

@Injectable({
  providedIn: 'root'
})
export class HabitatService {
  private apiUrl = 'https://bldr.habitat.sh/v1/depot/pkgs/core';

  constructor(private http: HttpClient) {}

  getPackages(page: number = 0, searchQuery?: string): Observable<HabitatPackageResponse> {
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
