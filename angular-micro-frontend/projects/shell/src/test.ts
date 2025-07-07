// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Manually load test files
import './app/app.component.spec';
import './app/services/habitat.service.spec';
import './app/components/habitat-packages.component.spec';
import './app/store/app.actions.spec';
import './app/store/app.reducer.spec';
import './app/store/app.selectors.spec';
import './app/store/app.effects.spec';
import './app/store/habitat/habitat.actions.spec';
import './app/store/habitat/habitat.reducer.spec';
import './app/store/habitat/habitat.selectors.spec';
import './app/store/habitat/habitat.effects.spec';
