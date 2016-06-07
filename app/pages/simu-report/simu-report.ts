import {Page, NavController} from 'ionic-angular';
import {SimulationService} from '../../providers/simulation-service/simulation-service';
import {ModelService} from '../../providers/model-service/model-service';
import {Simulation, SimulationOutput} from '../../data-types/data-types';
import {ResultUrlPage} from '../result-url/result-url';
import {ResultFilePage} from '../result-file/result-file';
import {Subject} from "rxjs/Rx";

@Page({
  templateUrl: 'build/pages/simu-report/simu-report.html',
})
export class SimuReportPage {

  private _selectedSimu : Simulation;
  private _showReport = false;
  private _showSummary = false;
  private _showResults = false;
  private _showDisplayButton = false;

  private _showLiveResults = true;
  private _simuIsAlive = false;
  private _liveResults : Array<SimulationOutput> = [];
  //private _liveResultsUpToDate = false;
  private _simuSubscription;

  constructor(public nav: NavController,
              private _simulationService: SimulationService,
              private _modelService: ModelService) {

    // Subscribe to model to know whether there are live results or not
    /*this._modelService.selectedModel$.subscribe(
      model => {
        console.log(model);
        this._liveResults = [];
        model.atomicBlocks.forEach(
          block => {
            block.params.forEach(
              param => {
                if (param.name === 'plotUrl') {
                  this._liveResults.push({label   : block.label,
                                          plotUrl : ''})} // value is defined at execution time
              });
          });
      });*/

      // Subscribe to simu
      /*this._simulationService.selectedSimu$.subscribe(
        simu => {
          console.log('***simu update***')
          if (!this._selectedSimu || simu.simu_name !== this._selectedSimu.simu_name) {
            this._liveResultsUpToDate = false;
          }
          this._selectedSimu = simu;
          this._simuIsAlive = this._selectedSimu.info.status === 'RUNNING' || this._selectedSimu.info.status === 'PAUSED';
          if (this._simuIsAlive && !this._liveResultsUpToDate) {
            console.log("ASK for Live results")
            this._simulationService.getSelectedSimuLiveResults().then(
              results => {
                this._liveResults = results;
                this._liveResultsUpToDate = true;
              }
            )
          }
        });*/
    // Subscribe to simu
    this._simuSubscription = this._simulationService.selectedSimu$.subscribe(
        simu => {
          this._simuIsAlive = simu.info.status === 'RUNNING' || simu.info.status === 'PAUSED';
          // If the selected simu has changed then poll until information about live results is returned
          // SOCKET_ERROR is returned as long as the simulation is in iniatialization phase
          if (this._simuIsAlive &&
             (!this._selectedSimu || simu.simu_name !== this._selectedSimu.simu_name)) {
            let stopPolling   = new Subject();
            let nbPoll        = 0;
            this._liveResults = [];
            this._simulationService.pollForLiveResultsUrl(stopPolling).subscribe(
              response => {
                nbPoll++;
                let jsonResponse = response.json();
                console.log(nbPoll);
                console.log(jsonResponse.success)
                if (jsonResponse.success) {
                  this._liveResults = jsonResponse.outputs;
                  stopPolling.next(true);
                }
                if (nbPoll>10) {
                  stopPolling.next(true);
                }
              });
            }
            // Update current simu
            this._selectedSimu = simu;
            if (this._selectedSimu.info.status === 'FINISHED') {
              // The DISPLAY button is shown only if there is at least 1 result as a file
              this._showDisplayButton = (this._selectedSimu.info.report.output.findIndex(item => {return item.filename}) >= 0);
            }
          }
        );
  }

  public onPageWillEnter() {
    this.refresh();
  }

  public onPageDidLeave() {
    //this._simuSubscription.unsubscribe();
  }

  public refresh() {
    this._simulationService.updateSelectedSimu();
  }

  public goToResultUrl(output : SimulationOutput){
    console.log(output)
    if (output.plotUrl) {
      this.nav.push(ResultUrlPage,
                    {modelName   : this._selectedSimu.info.model_name,
                     resultLabel : output.label,
                     plotUrl     : output.plotUrl})
    }
  }

  public goToResultFile(){
    console.log(this._selectedSimu.info.report.output)
    let listOfDisplayedResults = [];
    this._selectedSimu.info.report.output.forEach(
      o => {if (o.checked) {
        listOfDisplayedResults.push(o)}}
    );

    this.nav.push(ResultFilePage,
                  {modelName   : this._selectedSimu.info.model_name,
                   simuName     : this._selectedSimu.simu_name,
                   results     : listOfDisplayedResults});
  }

  public showReport(){
    this._showReport = !this._showReport;
  }

  public showSummary(){
    this._showSummary = !this._showSummary;
  }

  public showLiveResults() {
    this._showLiveResults = !this._showLiveResults;
  }

  public showResults() {
    this._showResults = !this._showResults;
  }

}
