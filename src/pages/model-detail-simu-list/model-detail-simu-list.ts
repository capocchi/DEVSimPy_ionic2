import { Component } from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import { SimulationService } from '../../providers/simulation-service/simulation-service';
import { Simulation } from '../../data-types/data-types';
import { ModelDetailSimuResultPage } from '../../pages/model-detail-simu-result/model-detail-simu-result';

@Component({
  templateUrl: 'model-detail-simu-list.html',
})
export class ModelDetailSimuListPage {

  public selectedSimu       : Simulation = null;
  public selectedModelSimus : Array<Simulation> = [];
  public _simuSubscription;
  public _simusSubscription;

  constructor(public nav: NavController,
              public _simulationService : SimulationService,
              public alertController: AlertController
            ) {

    this._simuSubscription = this._simulationService.selectedSimu$.subscribe(
      simu => {
        //console.log('receive simu in ModelDetailSimulationPage')
        //console.log(simu)
        this.selectedSimu = simu;
        this._simulationService.loadSimuList();
      });

    this._simusSubscription = this._simulationService.simus$.subscribe(
      simus => {
        if (this.selectedSimu) {
          this.selectedModelSimus = simus.filter(simu => {
            // Display simulations for the selectedModel
            // Do not display the simulation in progress
            // Display the current simulation if it is finished
            return simu.info.model_name === this.selectedSimu.info.model_name &&
              (simu.simu_name !== this.selectedSimu.simu_name || simu.info.status ==='FINISHED');
            });
          }
      });
    }

  ngOnDestroy() {
    this._simuSubscription.unsubscribe();
    this._simusSubscription.unsubscribe();
  }

  public goToSimu(model_name : string, simulation_name : string) {
    this._simulationService.loadSimu(simulation_name, model_name);
    this.nav.push(ModelDetailSimuResultPage);
  }

  public deleteSimu(simulation_name : string) {
    this._simulationService.deleteSimu(simulation_name);
  }

  public deleteRelatedSimu() {
    let alert = this.alertController.create({
      message : "Are you sure you want to delete these simulations?",
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
          this._simulationService.deleteModelSimu(this.selectedSimu.info.model_name);
          alert.dismiss();
          return false;}
        }
      ]
    });
    alert.present();
  }
}
