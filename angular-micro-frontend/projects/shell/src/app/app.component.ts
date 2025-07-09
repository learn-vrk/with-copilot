/**
 * @fileoverview Root application component for the Chef Habitat Package Explorer.
 * 
 * This component serves as the main shell for the application, providing
 * the basic layout and navigation structure.
 * 
 * @author Angular Development Team
 * @since 1.0.0
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectMessage, selectLoading, selectError } from './store/app.selectors';
import * as AppActions from './store/app.actions';

/**
 * Root application component that serves as the main shell.
 * 
 * This component provides the main application layout and handles
 * top-level application state through NgRX store integration.
 * 
 * Features:
 * - Application title and branding
 * - Navigation between different views
 * - Global loading and error state display
 * - NgRX store integration for app-level state
 * 
 * @example
 * ```html
 * <!-- This component is automatically bootstrapped -->
 * <app-root></app-root>
 * ```
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /** Application title displayed in the header */
  title = 'Shell Application';
  
  /** Observable for application-level messages */
  message$: Observable<string>;
  
  /** Observable for global loading state */
  loading$: Observable<boolean>;
  
  /** Observable for global error messages */
  error$: Observable<string | null>;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.message$ = this.store.select(selectMessage);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  /**
   * Component initialization lifecycle hook.
   * 
   * Dispatches the initial loadMessage action to populate
   * the application state with default messages.
   */
  ngOnInit() {
    this.store.dispatch(AppActions.loadMessage());
  }

  /**
   * Updates the application message through NgRX store.
   * 
   * @param newMessage - The new message to display
   * 
   * @example
   * ```typescript
   * this.updateMessage('Welcome to Habitat Package Explorer!');
   * ```
   */
  updateMessage(newMessage: string) {
    this.store.dispatch(AppActions.updateMessage({ message: newMessage }));
  }

  /**
   * Triggers loading of application messages.
   * 
   * @example
   * ```typescript
   * this.loadMessage(); // Refreshes the current message
   * ```
   */
  loadMessage() {
    this.store.dispatch(AppActions.loadMessage());
  }

  /**
   * Determines if the current route is the home page.
   * 
   * @returns True if currently on the home page route
   * 
   * @example
   * ```typescript
   * if (this.isHomePage()) {
   *   console.log('User is on the home page');
   * }
   * ```
   */
  isHomePage(): boolean {
    return this.router.url === '/';
  }
}
