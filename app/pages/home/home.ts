import {Page, NavController} from 'ionic-angular';
import { ModelListPage } from '../model-list/model-list';
import { SimulationListPage } from '../simulation-list/simulation-list';
import { SettingsPage } from '../settings/settings';
import { ConnectionService } from '../../providers/connection-service/connection-service';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private tabModelList;
  private tabSimuList;
  private tabSettings;

  constructor(public nav: NavController,
              private _connectionService: ConnectionService) {
    this.tabModelList = ModelListPage;
    this.tabSimuList  = SimulationListPage;
    this.tabSettings  = SettingsPage;
    console.log("init Home")
  }

}
