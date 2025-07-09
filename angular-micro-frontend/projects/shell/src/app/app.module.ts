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

@NgModule({
  declarations: [
    AppComponent,
    HabitatPackagesComponent
  ],
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
