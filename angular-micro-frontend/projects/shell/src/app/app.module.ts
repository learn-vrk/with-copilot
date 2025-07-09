/**
 * @fileoverview Main application module for the Chef Habitat Package Explorer
 * Angular application with Kendo UI and NgRX state management.
 * 
 * This module sets up:
 * - Kendo Angular UI components and theming
 * - NgRX store with reducers and effects
 * - Angular routing configuration
 * - Browser animations for Kendo components
 * - HTTP client for API communications
 * 
 * @author Angular Development Team
 * @since 1.0.0
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Kendo Angular imports
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

import { AppComponent } from './app.component';
import { HabitatPackagesComponent } from './components/habitat-packages.component';
import { appReducer } from './store/app.reducer';
import { habitatReducer } from './store/habitat/habitat.reducer';
import { AppEffects } from './store/app.effects';
import { HabitatEffects } from './store/habitat/habitat.effects';
import { environment } from '../environments/environment';

/**
 * Root application module that configures the entire Angular application.
 * 
 * Features configured:
 * - Kendo Angular UI components for modern interface
 * - NgRX state management with Redux DevTools
 * - Angular routing for navigation
 * - Browser animations for smooth UI transitions
 * - HTTP client for API communications
 * - Reactive forms for user interactions
 * 
 * @example
 * ```typescript
 * // This module is bootstrapped in main.ts
 * platformBrowserDynamic().bootstrapModule(AppModule)
 * ```
 */
@NgModule({
  /** Component declarations for this module */
  declarations: [
    AppComponent,
    HabitatPackagesComponent
  ],
  /** 
   * Module imports including Angular core modules and Kendo UI components.
   * 
   * Key imports:
   * - BrowserModule: Required for running in browser
   * - BrowserAnimationsModule: Enables animations for Kendo components
   * - Kendo UI modules: Grid, Inputs, Buttons, Layout, Indicators
   * - NgRX modules: Store, Effects, DevTools for state management
   * - RouterModule: Application routing configuration
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GridModule,
    InputsModule,
    ButtonsModule,
    LayoutModule,
    IndicatorsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: AppComponent
      },
      {
        path: 'packages',
        component: HabitatPackagesComponent
      }
    ]),
    StoreModule.forRoot({ 
      app: appReducer,
      habitat: habitatReducer 
    }),
    EffectsModule.forRoot([AppEffects, HabitatEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
