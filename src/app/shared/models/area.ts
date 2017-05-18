export class Area {
   hasContent: boolean = false;
   entities: Array<Entity> = [];
   production: Array<ITree> = [];
   outline;

   get uid(): number {
      return this._uid;
   }

   constructor(
      private id: number,
      private _uid: number,
      private fleet: number,
      private name: string,
      private property: string,
      private created: Date,
      private updated: Date) {
   }

   // todo outdated
   updateTracks(tracks: Array<any>) {

      let uniqeGuids = [];
      let entities = [];

      for (let i = 0; i < tracks.length; i++) {
         let index = uniqeGuids.indexOf(tracks[i].guid);
         if (index != -1) {
            // found machine push location history
            entities[index].locationHistory.push({ lat: tracks[i].lat, lng: tracks[i].lon });
         } else {
            // new machine
            uniqeGuids.push(tracks[i].guid);
            entities.push(new Entity(tracks[i].guid));

            entities[entities.length - 1].locationHistory.push({ lat: tracks[i].lat, lng: tracks[i].lon });
         }
      }
      this.entities = entities;
      console.log('updated: ' + entities.length + ' machines');
   }
}

export class Entity {
   guid: string;
   locationHistory: Array<ILocation> = [];

   constructor(guid) {
      this.guid = guid;
   }
}

export interface ITree {
   lat: number;
   lng: number;
   species: string;
}

export interface ILocation {
   lat: number;
   lng: number;
   status: string;
}