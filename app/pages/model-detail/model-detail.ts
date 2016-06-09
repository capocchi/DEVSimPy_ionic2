import { Page, NavController, NavParams, Tabs } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Model } from '../../data-types/data-types';
import { ModelService } from '../../providers/model-service/model-service';
import { ModelDetailDiagramPage } from '../model-detail-diagram/model-detail-diagram';
import { ModelDetailBlockPage } from '../model-detail-block/model-detail-block';
import { ModelDetailSimulationPage } from '../model-detail-simulation/model-detail-simulation';
import { ModelDetailSimuListPage } from '../model-detail-simu-list/model-detail-simu-list';
import { ModelDetailSimuResultPage } from '../model-detail-simu-result/model-detail-simu-result';

@Page({
  templateUrl: 'build/pages/model-detail/model-detail.html'
})
export class ModelDetailPage {
  private tabModelDiagram;
  private tabModelBlock;
  private tabSimulation;
  private tabSimuList;
  private tabSimuResult;
  @ViewChild('modelDetailTabs') tabRef: Tabs;

  constructor(private _modelService: ModelService,
              public nav: NavController,
              public navParams: NavParams) {
    console.log("CREATE ModelDetailPage")
    this.tabModelDiagram     = ModelDetailDiagramPage; //1
    this.tabModelBlock       = ModelDetailBlockPage; //2
    this.tabSimuList         = ModelDetailSimuListPage; //3
    this.tabSimulation       = ModelDetailSimulationPage; //4
    this.tabSimuResult       = ModelDetailSimuResultPage; //5
   }

  onPageWillEnter() {
    console.log("ENTER ModelDetailPage")
    this._modelService.republishModel(); // trick for Diagram correct display
    let selectedPage = this.navParams.get('selectedPage');
    if (selectedPage === 'Report') {
      this.tabRef.select(4);
    }
    if (selectedPage === 'Result') {
      console.log('SWITCH to 5 in ENTER ModelDetailPage')
      this.tabRef.select(5);
    }
  }

  onPageDidLeave() {
    console.log("LEAVE ModelDetailPage")
  }

  onPageDidUnload() {
    console.log("UNLOAD ModelDetailPage")
  }
  ngOnDestroy() {
    console.log("DESTROY ModelDetailPage")
  }

  goBackHome() {
    this.nav.pop();
  }

}
