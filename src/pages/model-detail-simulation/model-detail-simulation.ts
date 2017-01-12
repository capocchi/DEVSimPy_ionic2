import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { SimulationService } from '../../providers/simulation-service/simulation-service';
import { PusherService } from '../../providers/pusher-service/pusher-service';
import { Simulation } from '../../data-types/data-types';
import { ModelDetailSimuResultPage } from '../model-detail-simu-result/model-detail-simu-result';
import {Subject} from "rxjs/Rx";

@Component({
  templateUrl: 'model-detail-simulation.html',
})
export class ModelDetailSimulationPage {

  public simulatedDuration : number = 10;
  public simulator = 'PyDEVS'
  public _selectedSimu       : Simulation = null;
  public _simuSubscription;
  public _pusherProgressSubscription;
  public _pusherLiveSubscription;

  public _showReport = false;
  public _showSummary = false;
  public _simuIsAlive = false;
  public _progress = 0;

  constructor(public nav: NavController,
              public navParams : NavParams,
              public _simulationService : SimulationService,
              public _pusherService : PusherService) {

    //console.log('CREATE ModelDetailSimulationPage')
    this._simuSubscription = this._simulationService.selectedSimu$.subscribe(
          simu => {
            //console.log('UPDATE SIMU in ModelDetailSimulationPage ' + simu.simu_name + ' '+simu.info.status)
            this._simuIsAlive = simu.info.status === 'RUNNING' || simu.info.status === 'PAUSED';
            // Start listening on Pusher channel
            // upon selected simulation modification
            // or simulation start (name changes from NOT_STARTED to server defined id)
            if (!this._selectedSimu || simu.simu_name !== this._selectedSimu.simu_name) {
                 this._pusherService.listen(simu.simu_name);
              }
            // Update current simu
            this._selectedSimu = simu;
            }
          );

    this._pusherProgressSubscription = this._pusherService.progress$.subscribe(
      progress => {
        console.log('UPDATE PROGRESS in ModelDetailSimulationPage');
        this._progress = progress;
        if (progress === 100) {
          console.log('100%')
          // Switch to result tab
          this.nav.push(ModelDetailSimuResultPage);
          // There might be a delay between the reception of the 100% completion information
          // and the simulation process being really FINISHED (and returning results)
          setTimeout(() => {
            this.refreshSimu();

          }, 500);
        }
      }
    )

    this._pusherLiveSubscription = this._pusherService.liveStream$.subscribe(
      results => {
        if (results.length > 0) {
          // Switch to result tab
          this.nav.push(ModelDetailSimuResultPage);
        }
      }
    );
  }

  public ionViewWillEnter(){
    console.log('ENTER ModelDetailSimulationPage --> REFRESH');
    if (this._selectedSimu.info.status !== 'FINISHED') {
        this.refreshSimu();
    }
  }

  public ngOnDestroy() {
    console.log('DESTROY ModelDetailSimulationPage');
    this._simuSubscription.unsubscribe();
    this._pusherProgressSubscription.unsubscribe();
    this._pusherLiveSubscription.unsubscribe();
  }
  public startSimu() {
    this._simulationService.start(this.simulatedDuration, this.simulator);}

  public refreshSimu() {
    this._simulationService.updateSelectedSimu();}

  public pauseSimu() {
    this._simulationService.pauseSelectedSimu();}

  public resumeSimu() {
    this._simulationService.resumeSelectedSimu();}

  public killSimu() {
    this._simulationService.killSelectedSimu();}

  /*public goToResultUrl(output : SimulationOutput){
    this.nav.parent.select(5);

    if (output.plotUrl) {
      this.nav.push(ResultUrlPage,
                    {modelName   : this._selectedSimu.info.model_name,
                     resultLabel : output.label,
                     plotUrl     : output.plotUrl})
    }
  }*/

  /*public goToResultFile(){
    this.nav.parent.select(5);
    //console.log(this._selectedSimu.info.report.output)
    let listOfDisplayedResults = [];
    this._selectedSimu.info.report.output.forEach(
      o => {if (o.checked) {
        listOfDisplayedResults.push(o)}}
    );
    this.nav.push(ResultFilePage,
                  {modelName   : this._selectedSimu.info.model_name,
                   simuName     : this._selectedSimu.simu_name,
                   results     : listOfDisplayedResults});
  }*/

  public showReport(){
    this._showReport = !this._showReport;
  }

  public showSummary(){
    this._showSummary = !this._showSummary;
  }

}
