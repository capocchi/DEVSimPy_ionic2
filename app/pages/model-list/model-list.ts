import {Page, NavController} from 'ionic-angular';
//import {Observable} from 'rxjs/Observable';
//import { ModelDetailPage } from '../model-detail/model-detail';

import { ModelDetailPage } from '../model-detail/model-detail';
import { ModelService } from '../../providers/model-service/model-service';
import { SimulationService } from '../../providers/simulation-service/simulation-service';

@Page({
  templateUrl: 'build/pages/model-list/model-list.html'
})
export class ModelListPage {

  constructor(private _nav: NavController,
              private _modelService: ModelService,
              private _simulationService: SimulationService) {
  }

  onPageWillEnter() {
    //console.log("enter ModelList");
    this._modelService.loadModelsFromWS();
  }

  goToModel(model_name : string) {
    this._simulationService.loadSimu("NOT_STARTED", model_name);
    this._modelService.loadModel(model_name);
    console.log('PUSH ModelDetailPage')
    this._nav.push(ModelDetailPage);
  }

}
