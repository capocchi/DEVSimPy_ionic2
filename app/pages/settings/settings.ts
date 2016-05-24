import {Page, NavController} from 'ionic-angular';
import {ConnectionService} from '../../providers/connection-service/connection-service';

@Page({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {
  private _selectedServer : string = '';
  private _login : string = '';
  private _password : string = '';

  constructor(public nav: NavController,
              private _connectionService: ConnectionService) {
  }



  clearAll() {
    //TODO
    // Clear server list + publish with next()
    // Clear model list + publish with next()
  }

}
