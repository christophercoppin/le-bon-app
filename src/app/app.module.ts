import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { RestaurantSearchComponent } from './restaurant-search/restaurant-search.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfoWindowComponent } from './info-window/info-window.component';
@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    RestaurantsComponent,
    RestaurantDetailsComponent,
    RestaurantSearchComponent,
    InfoWindowComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
