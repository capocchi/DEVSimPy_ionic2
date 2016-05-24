import {Page, NavController, NavParams} from 'ionic-angular';
import { SimulationService } from '../../providers/simulation-service/simulation-service';
//import { PusherResultService } from '../../providers/pusher-result-service/pusher-result-service';
import { Simulation } from '../../data-types/data-types';
import { SimuResultPage } from '../simu-result/simu-result';

@Page({
  templateUrl: 'build/pages/model-detail-simulation/model-detail-simulation.html',
})
export class ModelDetailSimulationPage {

  public simulatedDuration : number = 10;

  constructor(public nav: NavController,
              private _simulationService : SimulationService) {
  }

  public startSimu() {
    //this._pusherService.listen();
    this._simulationService.start(this.simulatedDuration);
  }

  public refreshSimu() {
    this._simulationService.updateSelectedSimu();}

  public pauseSimu() {
    this._simulationService.pauseSelectedSimu();}

  public resumeSimu() {
    this._simulationService.resumeSelectedSimu();}

  public killSimu() {
    this._simulationService.killSelectedSimu();}

}
