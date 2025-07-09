/**
 * @fileoverview TypeScript interfaces and models for Chef Habitat packages
 * and NgRX state management.
 * 
 * This file defines the data structures used throughout the application
 * for handling Habitat package information and application state.
 * 
 * @author Angular Development Team
 * @since 1.0.0
 */

/**
 * Represents a Chef Habitat package with all its metadata.
 * 
 * @interface HabitatPackage
 * @example
 * const package: HabitatPackage = {
 *   origin: 'core',
 *   name: 'nginx',
 *   version: '1.21.0',
 *   release: '20210430123456',
 *   channels: ['stable', 'unstable'],
 *   platforms: ['x86_64-linux', 'x86_64-darwin']
 * };
 */
export interface HabitatPackage {
  /** The package origin (namespace/organization) */
  origin: string;
  /** The package name */
  name: string;
  /** The semantic version of the package */
  version: string;
  /** The release timestamp identifier */
  release: string;
  /** List of channels this package is available in */
  channels: string[];
  /** List of supported platforms/architectures */
  platforms: string[];
}

/**
 * Response structure from the Chef Habitat API for package queries.
 * 
 * @interface HabitatPackageResponse
 * @example
 * const response: HabitatPackageResponse = {
 *   range_start: 0,
 *   range_end: 9,
 *   total_count: 1250,
 *   data: []
 * };
 */
export interface HabitatPackageResponse {
  /** Starting index of the returned results */
  range_start: number;
  /** Ending index of the returned results */
  range_end: number;
  /** Total number of packages available */
  total_count: number;
  /** Array of package data */
  data: HabitatPackage[];
}

/**
 * NgRX state interface for managing Habitat package data and UI state.
 * 
 * @interface HabitatState
 * @example
 * const initialState: HabitatState = {
 *   packages: [],
 *   loading: false,
 *   error: null,
 *   totalCount: 0,
 *   currentPage: 0,
 *   pageSize: 10,
 *   searchQuery: ''
 * };
 */
export interface HabitatState {
  /** Array of currently loaded packages */
  packages: HabitatPackage[];
  /** Loading state indicator */
  loading: boolean;
  /** Error message if any operation fails */
  error: string | null;
  /** Total number of packages available on the server */
  totalCount: number;
  /** Current page index for pagination */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Current search query string */
  searchQuery: string;
}
