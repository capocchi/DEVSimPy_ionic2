import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {ModelService} from '../../providers/model-service/model-service';

@Component({
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public _selectedServer : string = '';
  public _login : string = '';
  public _password : string = '';

  constructor(public nav: NavController,
              public _connectionService: ConnectionService,
              public _modelService: ModelService) {
  }

  clearAll() {
    this._connectionService.clearStoredServers();
    this._modelService.clearStoredModels();
  }

}
