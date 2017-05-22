import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdButtonToggleModule, MdCheckboxModule, MdIconModule, MdDialogModule, } from '@angular/material';

import { AreaService } from './shared/services/area.service'
import { LiveTrackingService } from './shared/services/live-tracking.service'
import { SettingsService } from './shared/services/settings.service'

import { AppComponent } from './app.component';
import { AreaContainerComponent } from './area-container/area-container.component';
import { MapContainerComponent } from './map-container/map-container.component';
import { MapViewComponent } from './map-view/map-view.component';
import { AreaListingComponent } from './area-listing/area-listing.component';
import { AreaItemComponent } from './area-item/area-item.component';
import { MapRtComponent } from './map-rt/map-rt.component';
import { ProductionLayerComponent } from './map-container/production-layer/production-layer.component';
import { CollapseComponent } from './shared/components/collapse/collapse.component';
import { MachineLayerComponent } from './map-container/machine-layer/machine-layer.component';
import { NotificationLayerComponent, DialogOverviewExampleDialog} from './map-container/notification-layer/notification-layer.component';

@NgModule({
   declarations: [
      AppComponent,
      AreaContainerComponent,
      MapContainerComponent,
      MapViewComponent,
      AreaListingComponent,
      AreaItemComponent,
      MapRtComponent,
      ProductionLayerComponent,
      CollapseComponent,
      MachineLayerComponent,
      NotificationLayerComponent, DialogOverviewExampleDialog
   ],
   entryComponents: [DialogOverviewExampleDialog],
   imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      BrowserAnimationsModule,
      MdButtonModule, MdCheckboxModule, MdButtonToggleModule, MdIconModule, MdDialogModule
   ],
   providers: [
      AreaService,
      LiveTrackingService,
      SettingsService
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
