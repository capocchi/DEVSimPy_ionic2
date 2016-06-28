import {Page, NavController} from 'ionic-angular';
import {PusherService} from '../../providers/pusher-service/pusher-service';
import {Simulation, SimulationOutput, Result, ClassResult} from '../../data-types/data-types';
import {ViewChild} from '@angular/core';
import {SimulationService} from '../../providers/simulation-service/simulation-service';

declare var Plotly : any;

@Page({
  templateUrl: 'build/pages/model-detail-simu-result/model-detail-simu-result.html',
})
export class ModelDetailSimuResultPage {
  _resultsUrl  : Array<SimulationOutput> = [];
  _resultsFile : Array<SimulationOutput> = [];
  _showSelection : boolean = false;
  _label : string = '';
  _plotUrl : string = '';
  _showSpinner : boolean = false;
  @ViewChild('resultGraph') graph; // Only exists after view init

  private _selectedSimu    : Simulation = null;
  private _simuSubscription;
  private _pusherSubscription;

  LineGraphLayout = {
    yaxis: { title: ''},      // set the y axis title
    xaxis: {showgrid: false             // remove the x-axis grid lines
          //tickformat: "%B, %Y"        // customize the date format to "month, day"
          },
    margin: {l: 40, b: 20, r: 10, t: 10} // update the left, bottom, right, top margin
  };

  BarGraphLayout = {
    xaxis: {tickangle: -45} // Label inclination
    //margin: {l: 40, b: 0, r: 10, t: 10} // update the left, bottom, right, top margin
  };

  constructor(public nav: NavController,
              private _pusherService: PusherService,
              private _simulationService: SimulationService) {

    console.log("CREATE ModelDetailSimuResultPage")

    this._simuSubscription = this._simulationService.selectedSimu$.subscribe(
      simu => {
        console.log("UPDATE_SIMU in ModelDetailSimuResultPage " + simu.simu_name + ' ' + simu.info.status)

        // Selected simulation change --> Reset data
        if (!this._selectedSimu || this._selectedSimu.simu_name !== simu.simu_name) {
          // Reset
          this._resultsUrl = [];
          this._resultsFile = [];
          this._plotUrl = '';
          this._label   = 'No results yet';
          this._showSelection = false;
          if (this.graph) {this.resetLineGraphDiv();}
          //Listen for live results
          if (this._pusherSubscription) {this._pusherSubscription.unsubscribe();}
          this._pusherSubscription = this._pusherService.liveResult$.subscribe(
            results => {
              console.log('GET live results')
              console.log(results)
              this._resultsUrl = results; // should only contain results of URL type
              // display first by default
              if (results[0] && results[0].plotUrl) {
                this._plotUrl = results[0].plotUrl;
                this._label = results[0].label;
                // Force switch to Result Tab
                //this.nav.parent.select(5);
                this.startSpinner();
              }
            }
          );
        }

        // Process only first FINISHED report for a given simulation
        if (simu.info.status === 'FINISHED' &&
            (!this._selectedSimu || this._selectedSimu.simu_name !== simu.simu_name || this._selectedSimu.info.status !== 'FINISHED')) {
          this._resultsUrl = [];
          this._resultsFile = [];
          simu.info.report.output.forEach(
            o => {
              if (o.plotUrl) {this._resultsUrl.push(o)}
              if (o.filename) {this._resultsFile.push(o)}
            }
          )
          if (this._resultsUrl.length > 0) {
              this._plotUrl = this._resultsUrl[0].plotUrl;
          }
          if (this._resultsFile.length > 0) {
            this._resultsFile.forEach(result => {result.checked = true;});
            if (this.graph) {this.getResultAndDrawGraph();}
          }
          if (simu.info.report.output.length > 0) {
            this._label  = simu.info.report.output[0].label;
            this.startSpinner();
          }
        }

        this._selectedSimu = simu;
      }
    );

    //this.startSpinner();
  }

  /* onPageWillEnter() {
    console.log('ENTER ModelDetailSimuResultPage')
  }
  onPageDidLeave() {
    console.log('LEAVE ModelDetailSimuResultPage')
  }*/

  ngOnDestroy(){
    console.log('DESTROY ModelDetailSimuResultPage')
    this._simuSubscription.unsubscribe();
    this._pusherSubscription.unsubscribe();
  }

  public selectPlotUrl(output : SimulationOutput){
    this._plotUrl = output.plotUrl;
    this._label   = output.label;
    this.startSpinner();
  }

  public getResultAndDrawGraph(){
    this._showSelection = false;
    this.resetLineGraphDiv();
    this._resultsFile.forEach(
      result => {
        if (result.checked) {
          this._simulationService.getResultFileAsJSON(this._selectedSimu.simu_name, result.filename).subscribe(
            response => {
              let data = response.json().data;
              // Process various kinds of results
              if (data.length > 1 && typeof(data[0].value)==='number') {
                this.addDataToLineGraph(result.label, data)
              }
              if (data.length === 1 && typeof(data[0].value)==='string') {
                //try {
                  let classes : Array<ClassResult> = JSON.parse(data[0].value);
                  console.log(classes);
                  this.showClassificationGraph(result.label, classes);
                /*}
                catch (ex) {
                  console.log(ex)
                  //display()'Unexpected data types')
                }*/
              }
            });
        }
      }
    )
  }

  private resetLineGraphDiv(){
    Plotly.newPlot( this.graph.nativeElement, {x:[],y:[],type:'scatter'}, this.LineGraphLayout );
  }

  private addDataToLineGraph(label:string, data : Array<Result>) {
    let xyData = {x:[],
                  y:[],
                  type:'scatter',
                  name:label};

    data.forEach(r => {
      xyData.x.push(r.time);
      xyData.y.push(r.value);
    });

    Plotly.newPlot( this.graph.nativeElement, [xyData] , this.LineGraphLayout );
  }

  private showClassificationGraph(label:string, classes: Array<ClassResult>) {
    let xyData = {x:[],
                  y:[],
                  type:'bar',
                  name:'Classification'};

    classes.forEach( c => {
      xyData.x.push(c.label)
			xyData.y.push(c.score)
    })

    Plotly.newPlot( this.graph.nativeElement, [xyData] , this.BarGraphLayout );
  }

  public showSelection(){
    this._showSelection = true;
  }

  private startSpinner(){
    this._showSpinner = true;
    setTimeout(()=> {this._showSpinner = false}, 5000);
  }
}
