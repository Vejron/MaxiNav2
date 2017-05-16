export class Area {
   uid: number = 0;
   name: string = 'none';
   tracks: Array<Entity> = [];
   production: Array<Tree> = [];
   outline;

   constructor() {
   }

   updateTracks(tracks: Array<any>) {
      
      let uniqeGuids = [];
      let entitys = [];

      for (let i = 0; i < tracks.length; i++) {
         let index = uniqeGuids.indexOf(tracks[i].guid);
         if(index != -1) {
            // found machine push location history
            entitys[index].locationHistory.push({lat: tracks[i].lat, lng: tracks[i].lon});
         } else {
            // new machine
            uniqeGuids.push(tracks[i].guid);
            entitys.push(new Entity(tracks[i].guid));

            entitys[entitys.length - 1].locationHistory.push({lat: tracks[i].lat, lng: tracks[i].lon});
         }
      }
      console.log(entitys);
   }
}

export class Entity {
   guid: string;
   locationHistory: Array<ILocation> = [];

   constructor(guid) {
      this.guid = guid;
   }
}

export class Tree {
   type: string = 'pine';
   dbh: number = 100;
}

export interface ILocation {
   lat: number;
   lng: number;
}