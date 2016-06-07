import { Page, NavController, NavParams, Tabs } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Model } from '../../data-types/data-types';
import { ModelService } from '../../providers/model-service/model-service';
import { ModelDetailDiagramPage } from '../model-detail-diagram/model-detail-diagram';
import { ModelDetailBlockPage } from '../model-detail-block/model-detail-block';
import { ModelDetailSimulationPage } from '../model-detail-simulation/model-detail-simulation';
import { SimuReportPage } from '../simu-report/simu-report';

@Page({
  templateUrl: 'build/pages/model-detail/model-detail.html'
})
export class ModelDetailPage {
  private tabModelDiagram;
  private tabModelBlock;
  private tabSimulation;
  private tabSimuReport;
  @ViewChild('modelDetailTabs') tabRef: Tabs;

  constructor(private _modelService: ModelService,
              public nav: NavController,
              public navParams: NavParams) {
    this.tabModelDiagram     = ModelDetailDiagramPage; //1
    this.tabModelBlock       = ModelDetailBlockPage; //2
    this.tabSimulation       = ModelDetailSimulationPage; //3
    this.tabSimuReport       = SimuReportPage; //4
  }

  onPageWillEnter() {
    console.log("ENTER ModelDetailPage")
    this._modelService.republishModel(); // trick for Diagram correct display
    let selectedPage = this.navParams.get('selectedPage');
    if (selectedPage === 'Result') {
      this.tabRef.select(4);
    }
  }

  goBackHome() {
    this.nav.pop();
  }

}
