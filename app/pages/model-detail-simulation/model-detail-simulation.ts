import {Page, NavController, NavParams} from 'ionic-angular';
import { SimulationService } from '../../providers/simulation-service/simulation-service';
//import { PusherResultService } from '../../providers/pusher-result-service/pusher-result-service';
import { Simulation } from '../../data-types/data-types';
import { ModelDetailPage } from '../model-detail/model-detail';

@Page({
  templateUrl: 'build/pages/model-detail-simulation/model-detail-simulation.html',
})
export class ModelDetailSimulationPage {

  public simulatedDuration : number = 10;
  public selectedSimu       : Simulation = null;
  public selectedModelSimus : Array<Simulation> = [];
  private _parentPage : ModelDetailPage;
  private _simuSubscription;
  private _simusSubscription;

  constructor(public nav: NavController,
              private _simulationService : SimulationService,
              public navParams : NavParams) {

    this._parentPage = navParams.data;
    this._simuSubscription = this._simulationService.selectedSimu$.subscribe(
      simu => {
        console.log('receive simu in ModelDetailSimulationPage')
        console.log(simu)
        this.selectedSimu = simu;
        this._simulationService.loadSimuList();
      });

    this._simusSubscription = this._simulationService.simus$.subscribe(
      simus => {
        if (this.selectedSimu) {
          this.selectedModelSimus = simus.filter(simu => {
            // Display simulations for the selectedModel
            // Do not display the simulation in progress
            // Display the current simulation if it is finished
            return simu.info.model_name === this.selectedSimu.info.model_name &&
              (simu.simu_name !== this.selectedSimu.simu_name || simu.info.status ==='FINISHED');
            });
          }
      });
  }

  public onPageWillEnter(){
    console.log('enter ModelDetailSimulationPage');
    this.refreshSimu();
  }

  public onPageDidLeave() {
    //this._simuSubscription.unsubscribe();
  }

  public startSimu() {
    //this._pusherService.listen();
    this._simulationService.start(this.simulatedDuration);}

  public refreshSimu() {
    this._simulationService.updateSelectedSimu();
  }

  public pauseSimu() {
    this._simulationService.pauseSelectedSimu();}

  public resumeSimu() {
    this._simulationService.resumeSelectedSimu();}

  public killSimu() {
    this._simulationService.killSelectedSimu();}

  public goToSimu(model_name : string, simulation_name : string) {
    this._simulationService.loadSimu(simulation_name, model_name);
    this.nav.parent.select(4);
  }

  public deleteSimu(simulation_name : string) {
    this._simulationService.deleteSimu(simulation_name);
  }

}
