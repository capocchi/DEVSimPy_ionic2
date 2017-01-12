import {Component} from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Model } from '../../data-types/data-types';
import { ModelService } from '../../providers/model-service/model-service';
import { ModelListPage } from '../model-list/model-list';
import { ModelDetailDiagramPage } from '../model-detail-diagram/model-detail-diagram';
import { ModelDetailBlockPage } from '../model-detail-block/model-detail-block';
import { ModelDetailSimulationPage } from '../model-detail-simulation/model-detail-simulation';
import { ModelDetailSimuListPage } from '../model-detail-simu-list/model-detail-simu-list';
import { ModelDetailSimuResultPage } from '../model-detail-simu-result/model-detail-simu-result';

@Component({
  selector:'menu-model',
  templateUrl: 'model-detail.html'
})
export class ModelDetailPage {
  public modelList;
  public tabModelDiagram;
  public tabModelBlock;
  public tabSimulation;
  public tabSimuList;
  public tabSimuResult;

  //@ViewChild('modelDetailTabs') tabRef: Tabs;

  constructor(public _modelService: ModelService,
              public nav: NavController,
              public navParams: NavParams) {
    console.log("CREATE ModelDetailPage")
    this.modelList           = ModelListPage;
    this.tabModelDiagram     = ModelDetailDiagramPage; //1
    this.tabModelBlock       = ModelDetailBlockPage; //2
    this.tabSimuList         = ModelDetailSimuListPage; //3
    this.tabSimulation       = ModelDetailSimulationPage; //4
    this.tabSimuResult       = ModelDetailSimuResultPage; //5
   }

  ionViewWillEnter() {
    console.log("ENTER ModelDetailPage")
    //this._modelService.republishModel(); // trick for Diagram correct display
  }

  goBackHome() {
    console.log('go back')
    //this.nav.pop();
    this.nav.push(this.modelList)
  }

  goToDiagram() {
    this.nav.push(this.tabModelDiagram);
  }

  goToBlock() {
    this.nav.push(this.tabModelBlock);
  }

  goToSimuList() {
    this.nav.push(this.tabSimuList);
  }

  goToSimu() {
    this.nav.push(this.tabSimulation);
  }

  goToSimuResult() {
    this.nav.push(this.tabSimuResult);
  }
}
