import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/Rx";
import {Storage} from '@ionic/storage';
import {Server} from '../../data-types/data-types';

export const SERVER_URL_LIST = "SERVER_URL_LIST";
export const LAST_USED_SERVER_URL = "LAST_USED_SERVER_URL";
//const LAST_USED_LOGIN/LAST_USED_PASSWORD?

@Injectable()
export class ConnectionService {
  // A server is represented by its root URL

  // A Subject inherits from Observer AND Observable
  // --> it can BOTH emit new state AND be subscribed to
  // In addition, a BehaviorSubject has 2 advantages :
  // --> it provides the last published state upon subscription (no need to wait for a modification)
  // --> its current state can be read with the .getValue() method
  // BUT : In order to keep the data flow under the control of the service
  //       The Observer should not be made public but only the Observable part of the BehaviorSubject
  public _storedServersBS$ : BehaviorSubject<string[]> = new BehaviorSubject([]);
  public storedServers$ : Observable<string[]> = this._storedServersBS$.asObservable();

  public _serverBS$ : BehaviorSubject<Server> = new BehaviorSubject(null);
  public server$ : Observable<Server> = this._serverBS$.asObservable();

  constructor(public _http: Http,
              public _localStorage: Storage) {
    //console.log("init connection-service")
  }

  loadStoredServers() {
    this._localStorage.get(SERVER_URL_LIST).then(
      data  => { if (data) {
        this._storedServersBS$.next(JSON.parse(data));
        }
      },
      error => {console.log(error)}
    );
  }

  loadLastUsedServer() {
    this._localStorage.get(LAST_USED_SERVER_URL).then(
      data  => { if (data) {
        this._serverBS$.next(new Server(data, false, null));
        }
      },
      error => {console.log(error)}
    );
  }

  checkAndConnectServer(serverUrl : string) : Promise<Server>{
    if (serverUrl === '' && this._serverBS$.getValue()) {
      serverUrl = this._serverBS$.getValue().url;
    }
    //console.log("send request to " + serverUrl)
    // Check URL before storing it
    return this._http.get(`${serverUrl}/info`)
    .map(
      response => {
        if (response.status === 200) {
          //console.log('info = ')
          //console.log(response.json());
          // Update the list of stored servers if needed
          let serverIndex = this._storedServersBS$.getValue().findIndex(url => { return url === serverUrl })
          if (serverIndex < 0) {
            this._storedServersBS$.getValue().push(serverUrl);
            // update storage
            this._localStorage.set(SERVER_URL_LIST, JSON.stringify(this._storedServersBS$.getValue()));
            // publish new list
            this._storedServersBS$.next(this._storedServersBS$.getValue());
          }
          // set the new server as the server to be used
          let s = new Server(serverUrl, true, response.json());
          s.reformatInfo();
          this._serverBS$.next(s);
          this._localStorage.set(LAST_USED_SERVER_URL, serverUrl);
          return s;
        }
        else {
          //console.log('Invalid response status');
          let s = new Server(serverUrl, false, response);
          this._serverBS$.next(s);
          //console.log(response);
          return s;
        }
      }
      /*error => Handled by caller*/
    ).toPromise();
  }

  public clearStoredServers() {
    this._localStorage.remove(SERVER_URL_LIST);
    this._localStorage.remove(LAST_USED_SERVER_URL);
    this._storedServersBS$.next([]);
    this._serverBS$.next(null);
  }

}
