import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/Rx";
import {UrlResult, DataResult} from "../../data-types/result-diagram-types";
import {VisualizationService} from '../../providers/visualization-service/visualization-service';
//import {Pusher} from 'pusher-js';

const PUSHER_API_KEY = "c2d255356f53779e6020";
declare var Pusher : any;

@Injectable()
export class PusherService {
  // A Subject inherits from Observer AND Observable
  // --> it can BOTH emit new state AND be subscribed to
  // In addition, a BehaviorSubject has 2 advantages :
  // --> it provides the last published state upon subscription (no need to wait for a modification)
  // --> its current state can be read with the .getValue() method
  // BUT : In order to keep the data flow under the control of the service
  //       The Observer should not be made public but only the Observable part of the BehaviorSubject
  //
  // Progress information
  public _progressBS$    : BehaviorSubject<number> = new BehaviorSubject(0);
  public   progress$      : Observable<number> = this._progressBS$.asObservable();
  // URL where results are displayed or channel where Pusher pushes data
  public _liveStreamBS$  : BehaviorSubject<Array<UrlResult>> = new BehaviorSubject([]);
  public   liveStream$    : Observable<Array<UrlResult>> = this._liveStreamBS$.asObservable();
  // Data sent by collector models via Pusher are collected in VisualizationService
  //public _liveOutputBS$  : BehaviorSubject<Array<DataResult>> = new BehaviorSubject([]);
  //public   liveOutput$    : Observable<Array<DataResult>> = this._liveOutputBS$.asObservable();

  public _pusher;
  public _channel = null;

  constructor(public _visuService : VisualizationService) {
    //console.log("init pusher service");
    this._pusher = new Pusher(PUSHER_API_KEY, {encrypted: true});
  }

  listen(simu_name) {
    // Listen only on 1 channel = 1 simulation
    // TODO? : Listen to all requested simulations
    //        and store progress in simulation data
    console.log('LISTEN ' + simu_name)
    if (this._channel) {
      this._channel.unsubscribe();
      this._visuService.reset();
    }
    this._progressBS$.next(5); // To let the user know its START order has been taken into account
    this._liveStreamBS$.next([]);
    this._channel = this._pusher.subscribe(simu_name);
    //console.log("listen " + simu_name);
    //var that = this; // Javascript trick, this is undefined inside call-back

    this._channel.bind('progress', (data)=> {
      this._progressBS$.next(data.progress);
    });

    this._channel.bind('live_streams', (data) => {
      console.log('PUSHER');
      console.log(data)
      if (data.live_streams.length > 0) {
        data.live_streams.forEach(r => {
          if (r.plotUrl) {
            this._visuService.addUrlResult(r);
          }
          if (r.pusherChannel) {
            this._visuService.addDataStream();
          }
        });
      }
      this._liveStreamBS$.next(data.live_streams);
    });

    this._channel.bind('output', (data)=> {
      if (data) {
        data.forEach(r => {
          this._visuService.addDataResult(r);
        });
      }
    });
  }

  stoplistening() {
    this._channel.unsubscribe();
  }
}
