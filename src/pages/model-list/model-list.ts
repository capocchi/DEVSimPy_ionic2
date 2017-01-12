import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
//import {Observable} from 'rxjs/Observable';
//import { ModelDetailPage } from '../model-detail/model-detail';

import { ModelDetailDiagramPage } from '../model-detail-diagram/model-detail-diagram';
import { ModelService } from '../../providers/model-service/model-service';
import { SimulationService } from '../../providers/simulation-service/simulation-service';

@Component({
  templateUrl: 'model-list.html'
})
export class ModelListPage {

  constructor(public _nav: NavController,
              public _modelService: ModelService,
              public _simulationService: SimulationService) {
      console.log('init ModelListPage')
  }

  ionViewWillEnter() {
    console.log("enter ModelList");
    this._modelService.loadModelsFromWS();
  }

  goToModel(model_name : string) {
    this._simulationService.loadSimu("NOT_STARTED", model_name);
    this._modelService.loadModel(model_name);
    console.log('PUSH ModelDetailPage')
    this._nav.push(ModelDetailDiagramPage);
  }

}
