import {Page, NavController} from 'ionic-angular';
import {PusherService} from '../../providers/pusher-service/pusher-service';
import {Simulation, Model} from '../../data-types/data-types';
import {DataResult, UrlResult, Diagram} from '../../data-types/result-diagram-types';
import {ViewChild} from '@angular/core';
import {SimulationService} from '../../providers/simulation-service/simulation-service';
import {ModelService} from '../../providers/model-service/model-service';
import {VisualizationService} from '../../providers/visualization-service/visualization-service';

declare var Plotly : any;

@Page({
  templateUrl: 'build/pages/model-detail-simu-result/model-detail-simu-result.html',
})
export class ModelDetailSimuResultPage {
  _mainLabel     : string  = 'Results';
  _showSelection : boolean = false;
  @ViewChild('resultGraph') graph; // Only exists after view init
  _showSpinner       : boolean = false;

  _interactionDestinations : Array<string> = [];

  private _selectedSimu    : Simulation = null;
  private _simuSubscription;
  private _modelSubscription;

  constructor(public nav: NavController,
              private _pusherService: PusherService,
              private _simulationService: SimulationService,
              private _modelService: ModelService,
              private _visuService: VisualizationService
            )
  {
    console.log("CREATE ModelDetailSimuResultPage")

    this._simuSubscription = this._simulationService.selectedSimu$.subscribe(
      simu => {
        console.log("UPDATE_SIMU in ModelDetailSimuResultPage " + simu.simu_name + ' ' + simu.info.status)
        console.log(this._visuService.plotSelections);
        // If selected simulation changes --> Reset data
        if (!this._selectedSimu || this._selectedSimu.simu_name !== simu.simu_name) {
          // Reset
          this._mainLabel = simu.info.model_name;
          this._showSelection  = true;
        }

        // Process only first FINISHED report for a given simulation
        if (simu.info.status === 'FINISHED' &&
            (!this._selectedSimu || this._selectedSimu.simu_name !== simu.simu_name || this._selectedSimu.info.status !== 'FINISHED')) {

          console.log(simu.info.report.output);
          simu.info.report.output.forEach(
            o => {
              if (o.plotUrl) {
                this._visuService.addUrlResult({label : o.label, plotUrl : o.plotUrl});
                }
              if (o.filename) {
                this._simulationService.getResultFileAsJSON(this._selectedSimu.simu_name, o.filename).subscribe(
                    response => {
                      let data = response.json().data;
                      data.forEach(d => this._visuService.addDataResult({label : o.label, result : d}));
                    });
                }
              }
          )
        }

      this._selectedSimu = simu;
    });

    this._modelSubscription = this._modelService.selectedModel$.subscribe(
      data  => {this.getInteractionsFromModel(data);},
      error => console.log(error)
    );

  }

  ngOnDestroy(){
    console.log('DESTROY ModelDetailSimuResultPage')
    this._simuSubscription.unsubscribe();
    this._modelSubscription.unsubscribe();
  }

  public showAll(){
    this._showSelection = false;
    this._visuService.setGraphDiv(this.graph);
    this._visuService.show(this._visuService);
    if (this._visuService.selectedUrl) {
      this.startSpinner();
    }
  }

  public showSelection(){
    this._showSelection = true;
  }

  private startSpinner(){
    this._showSpinner = true;
    setTimeout(()=> {this._showSpinner = false}, 5000);
  }

  private getInteractionsFromModel(model:Model){
    /*this._interactionDestinations = [];
    model.cells.forEach(cell => {
      if (cell.type === 'devs.Link') {
        console.log(cell)
        if (cell.source.startsWith('Interaction')) {
          this._interactionDestinations.push(cell.target)
        }
      }
    })
    console.log(this._interactionDestinations)*/
    this._interactionDestinations = ['AddInterceptor']//TODO : Automatic */
  }

  public sendMsg(dest) {
    this._simulationService.sendMsgToSelectedSimu(dest);}
}
