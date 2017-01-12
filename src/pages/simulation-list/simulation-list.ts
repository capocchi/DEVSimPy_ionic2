import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ModelDetailSimuResultPage } from '../model-detail-simu-result/model-detail-simu-result';
import { ModelService } from '../../providers/model-service/model-service';
import { SimulationService } from '../../providers/simulation-service/simulation-service';


@Component({
  templateUrl: 'simulation-list.html',
})
export class SimulationListPage {
  constructor(public nav: NavController,
              public _modelService: ModelService,
              public _simulationService:SimulationService,
              public alertController: AlertController) {
      console.log('init SimuListPage')
  }

  ionViewWillEnter() {
    console.log("enter SimuList");
    this._simulationService.loadSimuList();
  }

  public goToSimu(model_name : string, simulation_name : string) {
    this._simulationService.loadSimu(simulation_name, model_name);
    this._modelService.loadModel(model_name);
    this.nav.push(ModelDetailSimuResultPage);
  }

  public deleteSimu(simulation_name : string) {
    this._simulationService.deleteSimu(simulation_name);
  }

  public deleteAllSimu() {
    let alert = this.alertController.create({
      message : "Are you sure you want to delete ALL simulations?",
      buttons: [
        {
        text: 'NO',
          handler: () => {
            alert.dismiss();
            return false;}
        },
        {
        text: 'YES',
        handler: () => {
          this._simulationService.deleteAllSimu();
          alert.dismiss();
          return false;}
        },
      ]
    });
    alert.present();
  }

  public confirmDeleteAllSimu() {


  }
}
