import { Page, NavController } from 'ionic-angular';
import { ModelDetailPage } from '../model-detail/model-detail';
import { ModelService } from '../../providers/model-service/model-service';
import { SimulationService } from '../../providers/simulation-service/simulation-service';


@Page({
  templateUrl: 'build/pages/simulation-list/simulation-list.html',
})
export class SimulationListPage {
  constructor(private _nav: NavController,
              private _modelService: ModelService,
              private _simulationService:SimulationService) {
  }

  onPageWillEnter() {
    console.log("enter SimuList");
    this._simulationService.loadSimuList();
  }

  public goToSimu(model_name : string, simulation_name : string) {
    this._simulationService.loadSimu(simulation_name, model_name);
    this._modelService.loadModel(model_name);
    this._nav.push(ModelDetailPage);
  }

  public deleteSimu(simulation_name : string) {
    this._simulationService.deleteSimu(simulation_name);
  }
}
