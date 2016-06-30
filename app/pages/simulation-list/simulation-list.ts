import { Page, NavController, Alert } from 'ionic-angular';
import { ModelDetailPage } from '../model-detail/model-detail';
import { ModelService } from '../../providers/model-service/model-service';
import { SimulationService } from '../../providers/simulation-service/simulation-service';


@Page({
  templateUrl: 'build/pages/simulation-list/simulation-list.html',
})
export class SimulationListPage {
  constructor(public nav: NavController,
              private _modelService: ModelService,
              private _simulationService:SimulationService) {
  }

  onPageWillEnter() {
    //console.log("enter SimuList");
    this._simulationService.loadSimuList();
  }

  public goToSimu(model_name : string, simulation_name : string) {
    this._simulationService.loadSimu(simulation_name, model_name);
    this._modelService.loadModel(model_name);
    this.nav.push(ModelDetailPage, {selectedPage : 'Result'});
  }

  public deleteSimu(simulation_name : string) {
    this._simulationService.deleteSimu(simulation_name);
  }

  public deleteAllSimu() {
    let alert = Alert.create({
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
    this.nav.present(alert);
  }

  private confirmDeleteAllSimu() {


  }
}
