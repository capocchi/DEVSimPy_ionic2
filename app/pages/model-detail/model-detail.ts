import {Page, NavController, NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Model } from '../../data-types/data-types';
import { ModelService } from '../../providers/model-service/model-service';
import { ModelDetailDiagramPage } from '../model-detail-diagram/model-detail-diagram';
import { ModelDetailBlockPage } from '../model-detail-block/model-detail-block';
//import { ModelDetailDescriptionPage } from '../model-detail-description/model-detail-description';
import { ModelDetailSimulationPage } from '../model-detail-simulation/model-detail-simulation';
import { SimuResultPage } from '../simu-result/simu-result';

@Page({
  templateUrl: 'build/pages/model-detail/model-detail.html'
})
export class ModelDetailPage {
  //private _model_name : string;
  //private _simu_name  : string; // empty if the model is not accessed from simulation but from model_list
  private tabModelDiagram;
  private tabModelBlock;
  //private tabModelDescription;
  private tabSimulation;
  private tabSimuResult;

  constructor(private _modelService: ModelService,
              public nav: NavController,
              public navParams: NavParams) {
    this.tabModelDiagram     = ModelDetailDiagramPage;
    this.tabModelBlock       = ModelDetailBlockPage;
    //this.tabModelDescription = ModelDetailDescriptionPage;
    this.tabSimulation       = ModelDetailSimulationPage;
    this.tabSimuResult       = SimuResultPage;
  }

  onPageWillEnter() {
    console.log("ENTER ModelDetailPage")
  }

  goBackHome() {
    this.nav.pop();
  }

}
