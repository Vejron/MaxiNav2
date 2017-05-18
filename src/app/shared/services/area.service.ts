import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Area, Entity, ITree } from '../models/area';

@Injectable()
export class AreaService {
   private areaDefsUrl = 'http://localhost:8080/felling/area_defs?companyId=';  // URL to web API
   private trackingUrl = 'http://localhost:8080/felling/tracking?areaUid=';  // URL to web API
   private productionUrl = 'http://localhost:8080/felling/production?areaUid=';  // URL to web API

   constructor(private http: Http) { }

   getAreaDefs(companyId: number = 231): Observable<Area[]> {
      return this.http.get(this.areaDefsUrl + companyId)
         .map(this.extractDefsData)
         .catch(this.handleError);
   }

   private extractDefsData(res: Response) {
      let body = res.json();
      let areas = body.map((areaDef) => {
         return new Area(
            parseInt(areaDef.arar_id),
            parseInt(areaDef.arar_uid),
            areaDef.arar_fleet,
            areaDef.arar_name,
            areaDef.arar_property,
            new Date(areaDef.arar_insertion_time),
            new Date(areaDef.last_updated));
      });
      return areas || {};
   }

   getTracking(areaUid: number = 642004): Observable<Entity[]> {
      return this.http.get(this.trackingUrl + areaUid)
         .map(this.extractTrackingData)
         .catch(this.handleError);
   }

   private extractTrackingData(res: Response) {
      let tracks = res.json();

      // sort flat structure into entity bins 
      let uniqeGuids = [];
      let entities = [];

      for (let i = 0; i < tracks.length; i++) {
         let index = uniqeGuids.indexOf(tracks[i].guid);
         if (index != -1) {
            // found machine push location history
            entities[index].locationHistory.push({ lat: tracks[i].lat, lng: tracks[i].lon, status: tracks[i].status });
         } else {
            // new machine
            uniqeGuids.push(tracks[i].guid);
            entities.push(new Entity(tracks[i].guid));

            entities[entities.length - 1].locationHistory.push({ lat: tracks[i].lat, lng: tracks[i].lon, status: tracks[i].status });
         }
      }

      return entities;
   }

   getProduction(areaUid: number = 642004): Observable<ITree[]> {
      return this.http.get(this.productionUrl + areaUid)
         .map(this.extractProductionData)
         .catch(this.handleError);
   }

   private extractProductionData(res: Response) : Array<ITree> {
      let production = res.json();

      return production.map( tree => {
         return {lat: tree.lat, lng: tree.lon, species: tree.species};
      });
   }

   private handleError(error: Response | any) {
      // In a real world app, you might use a remote logging infrastructure
      let errMsg: string;
      if (error instanceof Response) {
         const body = error.json() || '';
         const err = body.error || JSON.stringify(body);
         errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
         errMsg = error.message ? error.message : error.toString();
      }
      console.error(errMsg);
      return Observable.throw(errMsg);
   }

}
