import { Injectable } from '@angular/core';
import { Subscription, Observable, Observer, Subject } from 'rxjs/rx';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

@Injectable()
export class LiveTrackingService {

   private url = 'ws://localhost:8080';
   private socket$: WebSocketSubject<any>;
   private socketSubscription: Subscription;
   private interval = 1000;

   private tracking = new Subject<any>();
   public tracking$ = this.tracking.asObservable();
   private state$ = new Subject<any>();

   constructor() {
      this.socket$ = WebSocketSubject.create(this.url);
   }

   public startStream(interval: number = 1000): Observable<any> {
      this.interval = interval;
      this.connect();
      return this.tracking;
   }

   public endStream() {
      if (this.socket$.socket.CONNECTING || this.socket$.socket.OPEN) {
         this.socketSubscription.unsubscribe(); // close down socket
      }
   }

   private connect() {
      this.socketSubscription = this.socket$.subscribe(
         (message) => this.onWsRecive(message),
         (err) => this.wsError(err), // on error try to reconnect
         () => console.log('complete')
      );

      this.socket$.next(JSON.stringify({
         command: 'begin',
         interval: this.interval,
         areaUid: 642004
      }));
   }

   private onWsRecive(message) {
      console.log(message);
      this.tracking.next(message);
   }

   private wsError(err) {
      if (err) {
         this.socketSubscription.unsubscribe();
         setTimeout(() => {
            this.connect();
         }, 1000)
      }
   }
}