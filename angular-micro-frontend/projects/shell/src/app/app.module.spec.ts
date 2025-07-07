import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { HabitatPackagesComponent } from './components/habitat-packages.component';

describe('AppModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();
  });

  it('should create the module', () => {
    const module = TestBed.inject(AppModule);
    expect(module).toBeTruthy();
  });

  it('should declare AppComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should declare HabitatPackagesComponent', () => {
    const fixture = TestBed.createComponent(HabitatPackagesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should bootstrap AppComponent', () => {
    // This test verifies that the module is properly configured
    // by checking if we can create the main component
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have proper imports configured', () => {
    // Verify that essential modules are imported by checking if services are available
    const store = TestBed.inject(Store);
    expect(store).toBeTruthy();
  });
});
