import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdListModule ,MdButtonModule, MdCheckboxModule, MdIconModule } from '@angular/material';

import { AreaService } from './shared/services/area.service'
import { LiveTrackingService } from './shared/services/live-tracking.service'
import { SettingsService } from './shared/services/settings.service'

import { AppComponent } from './app.component';
import { AreaContainerComponent } from './area-container/area-container.component';
import { MapContainerComponent } from './map-container/map-container.component';
import { MapViewComponent } from './map-view/map-view.component';
import { AreaListingComponent } from './area-listing/area-listing.component';
import { AreaItemComponent } from './area-item/area-item.component';

@NgModule({
   declarations: [
      AppComponent,
      AreaContainerComponent,
      MapContainerComponent,
      MapViewComponent,
      AreaListingComponent,
      AreaItemComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      BrowserAnimationsModule,
      MdButtonModule, MdCheckboxModule, MdListModule, MdIconModule
   ],
   providers: [
      AreaService,
      LiveTrackingService,
      SettingsService
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
