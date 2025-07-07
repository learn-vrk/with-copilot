export interface HabitatPackage {
  origin: string;
  name: string;
  version: string;
  release: string;
  channels: string[];
  platforms: string[];
}

export interface HabitatPackageResponse {
  range_start: number;
  range_end: number;
  total_count: number;
  data: HabitatPackage[];
}

export interface HabitatState {
  packages: HabitatPackage[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}
