import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ModelListPage } from '../model-list/model-list';
import { SimulationListPage } from '../simulation-list/simulation-list';
import { SettingsPage } from '../settings/settings';
import { ConnectionService } from '../../providers/connection-service/connection-service';

@Component({
  selector: 'menu-home',
  templateUrl: 'home.html'
})

export class HomeMenu {
  public tabModelList : any = ModelListPage;
  public tabSimuList : any = SimulationListPage;
  public tabSettings : any = SettingsPage;

  constructor(public nav: NavController,
              public _connectionService: ConnectionService) {
      console.log('init HomePage')
  }

  goToModelList(){
    this.nav.push(this.tabModelList);
  }

  goToSimuList(){
    this.nav.push(this.tabSimuList);
  }

  goToSettings(){
    this.nav.push(this.tabSettings);
  }
}
