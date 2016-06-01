import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/Rx";

import {Simulation, Block} from '../../data-types/data-types';
import {ConnectionService} from '../connection-service/connection-service';

@Injectable()
export class SimulationService {

  // The List and the Selected Simulation are handled separately - no dependance
  // No simu_store is created since simulations statuses are to be updated (unless they are finished...)
  // A copy of the selectedSimu is kept for easy access to the simulation name

  // A Subject inherits from Observer AND Observable
  // --> it can BOTH emit new state AND be subscribed to
  // In addition, a BehaviorSubject has 2 advantages :
  // --> it provides the last published state upon subscription (no need to wait for a modification)
  // --> its current state can be read with the .getValue() method
  // BUT : In order to keep the data flow under the control of the service
  //       The Observer should not be made public but only the Observable part of the BehaviorSubject

  //private _selectedSimu  : Simulation;
  private _simusBS$        : BehaviorSubject<Array<Simulation>> = new BehaviorSubject([]);
  public   simus$          : Observable<Array<Simulation>> = this._simusBS$.asObservable();

  private _selectedSimuBS$ : BehaviorSubject<Simulation> = new BehaviorSubject(null);
  public   selectedSimu$   : Observable<Simulation> = this._selectedSimuBS$.asObservable();

  private _simuEndPoint : string;

  constructor(public _http: Http,
              private _connectionService: ConnectionService) {
    // Server is selected by the User :
    this._connectionService.server$.subscribe(
      server => {this._simuEndPoint = `${server.url}/simulations`}
    );
  }

  public loadSimuList() {
    this._http.get(`${this._simuEndPoint}`)
      .subscribe(
        response => {
          let simus = response.json().simulations;
          let simuStore = []
          if (simus) {
            simus.forEach(simu => {
              simuStore.push(new Simulation(simu.simulation_name, simu.info));
            })
          }
          // publish new list
          this._simusBS$.next(simuStore);
          console.log(this._simusBS$.getValue())
      },
      error => this.handleError(error)
    );
  }

  public loadSimu(simuName : string, modelName : string) {
    console.log("LOAD " + simuName + ' ' + modelName)
    if (simuName === "NOT_STARTED") {
      // store useful data = model_name
      let simu = new Simulation(simuName, {'model_name' : modelName, 'status' : "NOT_STARTED"});
      this._selectedSimuBS$.next(simu);
    } else {
      // initial value is replaced as soon as UpdateSimu returns a response
      let simu = new Simulation(simuName, {'model_name' : modelName, 'status' : "LOADING"});
      this._selectedSimuBS$.next(simu);
      this.updateSimu(simuName);
    }
  }

  public start(simulatedDuration: number) {
    this._selectedSimuBS$.getValue().simu_name = 'NOT_STARTED';
    this._selectedSimuBS$.getValue().info.simulated_duration = simulatedDuration;
    let modelName = this._selectedSimuBS$.getValue().info.model_name;

    let simuPostBody: string = `{"model_name":"${modelName}", "simulated_duration": ${simulatedDuration} }`;
    let headers = new Headers();
    headers.append('Content-Type','application/json;charset=UTF-8');
    headers.append('Accept','application/json');

    this._http.post(`${this._simuEndPoint}`, simuPostBody, {headers : headers})
      .subscribe(response => {
        let xSimu = response.json();

        // Test if the currently displayed simu is the one for which start was called before publishing updated status
        let selected = this._selectedSimuBS$.getValue();

        if (selected.simu_name === "NOT_STARTED" &&
            selected.info.model_name === xSimu.info.model_name &&
            selected.info.simulated_duration == xSimu.info.simulated_duration)
        {
          this._selectedSimuBS$.next(new Simulation(xSimu.simulation_name, xSimu.info));
        }
        }
      )
  }

  public updateSimu(simuName) {
    if (simuName !== 'NOT_STARTED' && simuName !== 'FINISHED') {
      this._http.get(`${this._simuEndPoint}/${simuName}`)
        .subscribe(response => {
          let xSimu = response.json();
          if (xSimu.simulation_name === this._selectedSimuBS$.getValue().simu_name) {
            this._selectedSimuBS$.next(new Simulation(xSimu.simulation_name, xSimu.info));
          }
        });
    }
  }

  public updateSelectedSimu() {
    this.updateSimu(this._selectedSimuBS$.getValue().simu_name);
  }

  public pauseSelectedSimu() {
    // PUT request for pause has an empty body
    this._http.put(`${this._simuEndPoint}/${this._selectedSimuBS$.getValue().simu_name}/pause`, '')
      .subscribe(response => {
        console.log(response);
        this.updateSimu(response.json().simulation_name);
      });
  }

  public resumeSelectedSimu() {
    // PUT request for resume has an empty body
    this._http.put(`${this._simuEndPoint}/${this._selectedSimuBS$.getValue().simu_name}/resume`, '')
      .subscribe(response => {
        console.log(response);
        this.updateSimu(response.json().simulation_name);
      });
  }

  public killSelectedSimu() {
    // PUT request for kill has an empty body
    this._http.put(`${this._simuEndPoint}/${this._selectedSimuBS$.getValue().simu_name}/kill`, '')
      .subscribe(response => {
        console.log(response);
        this.updateSimu(response.json().simulation_name);
      });
  }

  public modifyModelParameters (block : Block) : Promise<string> {
    let url = `${this._simuEndPoint}/${this._selectedSimuBS$.getValue().simu_name}/atomics/${block.label}/params`;
    let body = block.toJSONstring();
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type','application/json; charset=utf-8');
    return this._http.put(url, body, {headers : headers})
      .map (response => {
        let alertText = "Parameters modified in simulation";
        if (!response.json().success) {
          alertText = "Parameters modification failed. Rloaeason : " + response.json().info;
        }
        return alertText;} )
      .toPromise();

  }

  public getSelectedSimuOutputs() {
    let url = `${this._simuEndPoint}/${this._selectedSimuBS$.getValue().simu_name}/outputs`;
    this._http.get(url).subscribe(
      response => {
        console.log(this._selectedSimuBS$.getValue().simu_name)
        let jsonResponse = response.json();
        console.log(jsonResponse)
        console.log(jsonResponse.outputs)
        if (jsonResponse.success) {
          if (jsonResponse.simulation_name === this._selectedSimuBS$.getValue().simu_name) {
            this._selectedSimuBS$.getValue().outputs = jsonResponse.outputs;
            this._selectedSimuBS$.next(this._selectedSimuBS$.getValue());
            console.log(this._selectedSimuBS$.getValue())
          }
        }
      }
    )
  }

  public deleteSimu(simuName : string) {
    // PUT request for kill has an empty body
    this._http.delete(`${this._simuEndPoint}/${simuName}`)
      .subscribe(response => {
        console.log(response);
        this.loadSimuList();
      });
  }

  private handleError (error: Response) {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    //return Observable.throw(error.json().error || 'Server error');
  }
}

// Automicaly generated Service class
/*export class SimulationService {
  data: any = null;

  constructor(public http: Http) {}

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('path/to/data.json')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }
}*/
