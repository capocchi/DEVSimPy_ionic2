import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/Rx";
import {SimulationOutput} from "../../data-types/data-types";
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
  private _progressBS$    : BehaviorSubject<number> = new BehaviorSubject(0);
  public   progress$      : Observable<number> = this._progressBS$.asObservable();
  private _liveResultBS$  : BehaviorSubject<Array<SimulationOutput>> = new BehaviorSubject([]);
  public   liveResult$    : Observable<Array<SimulationOutput>> = this._liveResultBS$.asObservable();
  private _pusher;
  private _channel = null;

  constructor() {
    //console.log("init pusher service");
    this._pusher = new Pusher(PUSHER_API_KEY, {encrypted: true});
  }

  listen(simu_name) {
    // Listen only on 1 channel = 1 simulation
    // TODO : Listen to all requested simulations
    //        and store progress in simulation data
    console.log('LISTEN ' + simu_name)
    if (this._channel) {
      this._channel.unsubscribe();
    }
    this._progressBS$.next(5); // To let the user know its START order has been taken into account
    this._liveResultBS$.next([]);
    this._channel = this._pusher.subscribe(simu_name);
    //console.log("listen " + simu_name);
    var that = this; // Javascript trick, this is undefined inside call-back
    this._channel.bind('progress', function(data) {
      that._progressBS$.next(data.progress);
    });
    this._channel.bind('live_streams', function(data) {
      that._liveResultBS$.next(data.live_streams);
    });
  }

  stoplistening() {
    this._channel.unsubscribe();
  }
}
