import {Page, NavController, NavParams} from 'ionic-angular';
import { SimulationService } from '../../providers/simulation-service/simulation-service';
import { PusherService } from '../../providers/pusher-service/pusher-service';
import { Simulation, SimulationOutput } from '../../data-types/data-types';
import { ModelDetailPage } from '../model-detail/model-detail';
import {ResultUrlPage} from '../result-url/result-url';
import {ResultFilePage} from '../result-file/result-file';
import {Subject} from "rxjs/Rx";

@Page({
  templateUrl: 'build/pages/model-detail-simulation/model-detail-simulation.html',
})
export class ModelDetailSimulationPage {

  public simulatedDuration : number = 10;
  private _selectedSimu       : Simulation = null;
  private _simuSubscription;
  private _pusherSubscription;

  private _showReport = false;
  private _showSummary = false;
  private _simuIsAlive = false;
  private _progress = 0;

  constructor(public nav: NavController,
              public navParams : NavParams,
              private _simulationService : SimulationService,
              private _pusherService : PusherService) {

    console.log('CREATE ModelDetailSimulationPage')
    this._simuSubscription = this._simulationService.selectedSimu$.subscribe(
          simu => {
            console.log('UPDATE SIMU in ModelDetailSimulationPage ' + simu.simu_name + ' '+simu.info.status)
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

    this._pusherSubscription = this._pusherService.progress$.subscribe(
      progress => {
        console.log('UPDATE PROGRESS in ModelDetailSimulationPage');
        this._progress = progress;
        if (progress === 100) {
          console.log('100%')
          // There might be a delay between the reception of the 100% completion information
          // and the simulation process being really FINISHED (and returning results)
          setTimeout(() => {
            this.refreshSimu();
            // Switch to result tab
            console.log("SWITCH to 5 on progress 100% reception in ModelDetailSimulationPage")
            this.nav.parent.select(5);
          }, 500);
        }
      }
    )

  }

  public onPageWillEnter(){
    console.log('ENTER ModelDetailSimulationPage --> REFRESH');
    if (this._selectedSimu.info.status !== 'FINISHED') {
        this.refreshSimu();
    }
  }

  /*public onPageDidLeave() {
    console.log('LEAVE ModelDetailSimulationPage');
  }*/

  public ngOnDestroy() {
    console.log('DESTROY ModelDetailSimulationPage');
    this._simuSubscription.unsubscribe();
    this._pusherSubscription.unsubscribe();
  }
  public startSimu() {
    this._simulationService.start(this.simulatedDuration);}

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
