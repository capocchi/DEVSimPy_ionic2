import { Page, NavController, NavParams, Tabs } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Model } from '../../data-types/data-types';
import { ModelService } from '../../providers/model-service/model-service';
import { ModelDetailDiagramPage } from '../model-detail-diagram/model-detail-diagram';
import { ModelDetailBlockPage } from '../model-detail-block/model-detail-block';
import { ModelDetailSimulationPage } from '../model-detail-simulation/model-detail-simulation';
import { SimuResultPage } from '../simu-result/simu-result';

@Page({
  templateUrl: 'build/pages/model-detail/model-detail.html'
})
export class ModelDetailPage {
  private tabModelDiagram;
  private tabModelBlock;
  private tabSimulation;
  private tabSimuResult;
  @ViewChild('modelDetailTabs') tabRef: Tabs;

  constructor(private _modelService: ModelService,
              public nav: NavController,
              public navParams: NavParams) {
    this.tabModelDiagram     = ModelDetailDiagramPage;
    this.tabModelBlock       = ModelDetailBlockPage;
    this.tabSimulation       = ModelDetailSimulationPage;
    this.tabSimuResult       = SimuResultPage;
  }

  onPageDidEnter() {
    console.log("ENTER ModelDetailPage")
    let selectedPage = this.navParams.get('selectedPage');
    console.log(selectedPage)
    if (selectedPage === 'Result') {
      this.goToResultTab();
    }
  }

  goToResultTab() {
    this.tabRef.select(4);
  }

  goBackHome() {
    this.nav.pop();
  }

}
