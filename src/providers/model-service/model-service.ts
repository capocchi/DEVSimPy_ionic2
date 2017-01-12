import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/Rx";
import {Storage} from '@ionic/storage';
import {ConnectionService} from '../connection-service/connection-service';
import {Model, Block} from '../../data-types/data-types';
import { Transfer } from 'ionic-native';

const STORED_MODELS = "STORED_MODELS";

@Injectable()
export class ModelService {

  public _modelsEndPoint : string;

  public _modelStore   : Array<Model> = [];
  // Although it would be useful to have _modelStore indexed on the model_name
  // we declare it as an array and not a map because the ngFor directive only works with arrays

  // A Subject inherits from Observer AND Observable
  // --> it can BOTH emit new state AND be subscribed to
  // In addition, a BehaviorSubject has 2 advantages :
  // --> it provides the last published state upon subscription (no need to wait for a modification)
  // --> its current state can be read with the .getValue() method
  // BUT : In order to keep the data flow under the control of the service
  //       The Observer should not be made public but only the Observable part of the BehaviorSubject
  public _modelsBS$    : BehaviorSubject<Array<Model>> = new BehaviorSubject([]);
  public   models$      : Observable <Array<Model>> = this._modelsBS$.asObservable();

  public _selectedModelIndex : number;
  public _selectedModelBS$   : BehaviorSubject<Model> = new BehaviorSubject(null);
  public   selectedModel$     : Observable<Model> = this._selectedModelBS$.asObservable();

  constructor(public _http: Http,
              public _connectionService: ConnectionService,
              public _localStorage : Storage) {

    // Read models from local storage if exist
    this._modelStore = [];
    this._localStorage.get(STORED_MODELS).then(
      data  => {
        if (data) {
          let modelsData = JSON.parse(data);
          // Transform the model JSON representation to a Model Object (with associated operations!)
          modelsData.forEach( modelData => {
            let model = new Model(modelData.model_name, modelData.last_modified, modelData.size);
            model.update(modelData)
            this._modelStore.push (model);
          })
          this._modelsBS$.next(this._modelStore);
        }
      },
      error => {this.handleError(error)}
    );

    // Server is selected by the User :
    this._connectionService.server$.subscribe(
      server => {
        if (server) {
          this._modelsEndPoint = `${server.url}/models`;
        }
      }
    );

    // Update from server is done when the page is entered

  }

  public clearStoredModels() {
    this._localStorage.remove(STORED_MODELS);
    this._modelStore.splice(0);
    this._modelsBS$.next(this._modelStore);
  }

  public loadModelsFromWS() {
    this._http.get(this._modelsEndPoint).subscribe(
      response => {
        let xModels = response.json().models;
        console.log(xModels);
        let newStore : Array<Model> = [];
          // Convert received array to internal Model type array using map
        if (xModels) {
          xModels.map((xModel: any) => {
            // Find corresponding stored model if exists
            let index =  this._modelStore.findIndex(item => { return item.model_name === xModel.model_name });
            if (index >= 0) {
              // Model is already known
              if (xModel.last_modified !== this._modelStore[index].last_modified) {
                // If model has been modified then remove stored representation if any
                this._modelStore[index].reset(xModel.last_modified, xModel.size);
              }
              newStore.push(this._modelStore[index]);
            }
            else { // New model
              newStore.push(new Model (xModel.model_name, xModel.last_modified, xModel.size));
            }
          });
        };
        this._modelStore = newStore;
        this._localStorage.set(STORED_MODELS, JSON.stringify(this._modelStore));
        this._modelsBS$.next(this._modelStore);
      },
      error => this.handleError(error)
    );
  }

  public loadModel (model_name: string) {
    const _modelUrl = `${this._modelsEndPoint}/${model_name}`;

    this._selectedModelIndex = this._modelStore.findIndex(item => { return item.model_name === model_name });
    // See above why we use an array and not a map (explanation next to _modelStore declaration)

    // Push selected model representation even if empty (to replace values from previously selected model)
    this._selectedModelBS$.next(this._modelStore[this._selectedModelIndex]);

    // If model representation is empty (either never loaded or outdated)
    // then get up-to-date representation from server
    if (this._modelStore[this._selectedModelIndex].cells.length === 0) {
      //console.log('get from WS')
      // Expect response as JSON <==> Accept = application/json
      let headers = new Headers();
      headers.append('Accept','application/json');

      this._http.get(_modelUrl, {headers : headers})
        .subscribe(
          response => {
            // Update service variable
            this._modelStore[this._selectedModelIndex].update(response.json().model);
            // Publish new model
            this._selectedModelBS$.next(this._modelStore[this._selectedModelIndex]);
            // Store in Local Storage
            this._localStorage.set("ModelList", JSON.stringify(this._modelStore));
          },
          error => this.handleError(error)
        );
    }
    else {
      //console.log('model already loaded')
    }
  }

  public republishModel() {
    this._selectedModelBS$.next(this._modelStore[this._selectedModelIndex]);
  }

  public saveModelParameters(block : Block) : Promise<string> {
    let url = `${this._modelsEndPoint}/${this._selectedModelBS$.getValue().model_name}/atomics/${block.label}/params`;

    let body = block.toJSONstring();

    let headers = new Headers();
    headers.append('Content-Type','application/json; charset=utf-8');

    return this._http.put(url, body, {headers : headers})
      .map(response => {
        let alertText = "Parameters saved to model file";
        if (!response.json().success) {
          alertText = "Parameters save failed";
        }
        return alertText;
      })
      .toPromise();
  }

  public uploadPicture(img : any, blockLabel : string) : Promise<string> {
    let url = `${this._modelsEndPoint}/${this._selectedModelBS$.getValue().model_name}/atomics/${blockLabel}/images`;

    const fileTransfer = new Transfer();
    const options = {
      fileKey  : "upload",
      fileName : img.substr(img.lastIndexOf('/')+1)
      //mimeType : default = image/jpeg
    }
    return fileTransfer.upload(img, encodeURI(url), options)
    .then (response => {
      //console.log(response);
      let filename = JSON.parse(response.response).image_filename;
      return `${url}/${filename}`;
    });

  }

  public handleError (error: Response) {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    //return Observable.throw(error.json().error || 'Server error');
  }
}
