import {Page, NavController, NavParams} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Result, SimulationOutput} from '../../data-types/data-types';
import {SimulationService} from '../../providers/simulation-service/simulation-service';

//declare var Chart : any;
declare var Plotly : any;

@Page({
  templateUrl: 'build/pages/result-file/result-file.html',
})
export class ResultFilePage {

  @ViewChild('resultPlotly') result;
  modelName   : string = '';
  simuName    : string = '';
  resultFiles : Array<SimulationOutput> = [];

  constructor(public nav: NavController,
              public navParams: NavParams,
              private _simulationService: SimulationService) {

    this.modelName   = this.navParams.get('modelName');
    this.simuName    = this.navParams.get('simuName');
    this.resultFiles = this.navParams.get('results');
  }

  //onPageWillEnter(){ --> NOK : View does not exist yet
  ngAfterViewInit(){
    let layout = {
      yaxis: { title: ''},      // set the y axis title
      xaxis: {
        showgrid: false                  // remove the x-axis grid lines
        //tickformat: "%B, %Y"              // customize the date format to "month, day"
      },
      margin: {                           // update the left, bottom, right, top margin
        l: 40, b: 20, r: 10, t: 10
      }
    };

    this.resultFiles.forEach(
      file => {
        this._simulationService.getResultFileAsJSON(this.simuName, file.filename).subscribe(
          response => {
            let result = response.json().data;
            console.log("NB results")
            console.log(result.length)
            let data  = {x:[],
                         y:[],
                         mode:'lines',
                         name:file.label};
            result.forEach(r => {
              data.x.push(r.time);
              data.y.push(r.value);
            });

            Plotly.plot( this.result.nativeElement, [data] , layout );
          });
      }
    )

    /*this._simulationService.getResultFileAsJSON(this.simuName, this.resultFilename).subscribe(
      response => {
        let result = response.json().data;
        let data = [{x:[], y:[]}];
        result.forEach(r => {
          data[0].x.push(r.time);
          data[0].y.push(r.value);
        });
        let layout = {
          yaxis: { title: this.resultLabel},      // set the y axis title
          xaxis: {
            showgrid: false                  // remove the x-axis grid lines
            //tickformat: "%B, %Y"              // customize the date format to "month, day"
          },
          margin: {                           // update the left, bottom, right, top margin
            l: 40, b: 20, r: 10, t: 10
          }
        };
        Plotly.plot( this.result.nativeElement, data, layout );
      }
    )*/
  }


  /*constructor(public nav: NavController,
              public navParams: NavParams,
              private _simulationService: SimulationService) {

    // View does not exist yet
    this._res = [];
    // Chart JS global configuration
    Chart.defaults.global.animation.duration = 0;
    Chart.defaults.global.elements.line.tension = 0;
    //
    this.resultLabel    = this.navParams.get('resultLabel');
    this.resultFilename = this.navParams.get('filename');
    this.simuName       = this.navParams.get('simuName');
  }

  //onPageWillEnter(){ --> NOK : View does not exist yet
  ngAfterViewInit(){
    this._ctx = this.canvas.nativeElement.getContext("2d");
    let chartInput = {labels : [], datasets : []};
    chartInput.datasets[0] = { // TODO move to global config
      label: this.resultLabel,
      fillColor : "#FFFFFF",
      strokeColor : "#0000FF",
      pointColor : "#FFFFFF",
      pointStrokeColor : "#FFFFFF",
      pointHighlightFill : "#FFFFFF",
      pointHighlightStroke : "#FFFFFF",
      data : []
    };

    this._simulationService.getResultFileAsJSON(this.simuName, this.resultFilename).subscribe(
      response => {
        let result = response.json().data;
        result.forEach(r => {
          chartInput.labels.push(r.time);
          chartInput.datasets[0].data.push(r.value);
        });
        this._chart = new Chart(this._ctx, {type: 'line', data:chartInput, pointDot: false});
      }
    )


    //this._chart.update();
    this._pusherService.result$.subscribe(
      result  => {
        //this._res.push(result);
        console.log(result);
        //if (parseInt(result.label)%50 == 0)
        this._chart.data.labels.push(result.label);
        this._chart.data.datasets[0].data.push(result.value);
        //if (this._chart.data.datasets[0].data.length%10 === 0) {
        //  this._chart.update(); --> ERROR : More tasks executed then were scheduled
        //}
      },
      error => console.log(error)
    );
  }

  refresh() {
    this._chart.update();
  }*/
}
