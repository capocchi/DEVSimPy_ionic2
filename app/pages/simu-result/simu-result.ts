import {Page, NavController} from 'ionic-angular';
import {ViewChild} from '@angular/core';
//import {PusherResultService} from '../../providers/pusher-result-service/pusher-result-service';
import {Result} from '../../data-types/data-types';
import {InAppBrowser} from 'ionic-native';
//import {Chart} from 'chart.js';

declare var Chart : any;

@Page({
  templateUrl: 'build/pages/simu-result/simu-result.html',
})
export class SimuResultPage {
  @ViewChild('result') canvas;
  private _res : Result[];
  private _ctx;
  private _chart;

  constructor(public nav: NavController) {
    // View does not exist yet
    console.log("init SimuResultPage");
    this._res = [];
    // Chart JS global configuration
    //Chart.defaults.global.animation.duration = 0;
    Chart.defaults.global.elements.line.tension = 0;

  }

  //onPageWillEnter(){ --> NOK : View does not exist yet
  ngAfterViewInit(){
    console.log('init result graph');
    this._ctx = this.canvas.nativeElement.getContext("2d");
    let chartInput = {labels : [], datasets : []};
    chartInput.datasets[0] = { // TODO move to global config
      label: "chart",
      fillColor : "rgba(0,0,0,0)",
      strokeColor : "#388E3C",
      pointColor : "rgba(0,0,0,0)",
      pointStrokeColor : "#fff",
      pointHighlightFill : "#fff",
      pointHighlightStroke : "rgba(0,0,0,0)",
      data : []
    };

    //console.log(this._res);

    this._chart = new Chart(this._ctx, {type: 'line', data:chartInput});

    //console.log(this._chart.data.datasets[0].data);

    /*this._pusherService.result$.subscribe(
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
    );*/
  }

  refresh() {
    this._chart.update();
  }

  goToPlotly() {
    InAppBrowser.open("https://plot.ly", "_system", "location=yes");
  }
}
