import {Page, NavController} from 'ionic-angular';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {ModelService} from '../../providers/model-service/model-service';

@Page({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {
  private _selectedServer : string = '';
  private _login : string = '';
  private _password : string = '';

  constructor(public nav: NavController,
              private _connectionService: ConnectionService,
              private _modelService: ModelService) {
  }
 
  clearAll() {
    this._connectionService.clearStoredServers();
    this._modelService.clearStoredModels();
  }

}
