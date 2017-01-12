import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import { AfterContentInit } from '@angular/core';
//import {ViewChild, ElementRef} from '@angular/core';
import {ModelService} from '../../providers/model-service/model-service';
import {Model} from '../../data-types/data-types';
import {Observable} from 'rxjs/Observable';

declare var joint : any;

@Component({
  templateUrl: 'model-detail-diagram.html'
})
export class ModelDetailDiagramPage implements AfterContentInit {

  //@ViewChild('map') map: ElementRef;
  public map;//: ElementRef;
  public _modelSubscription = null;
  private _model : Model;

  constructor(public nav: NavController,
              public _modelService: ModelService) {
    // View does not exist yet
    console.log('CREATE ModelDetailDiagramPage');
    this._modelSubscription = this._modelService.selectedModel$.subscribe(
      model  => {
        //console.log("receive new model in ModelDetailDiagramPage");
        //this.draw(data);
        this._model = model;
        if (this.map) {
          this.draw(this._model);
        }
      },
      error => console.log(error)
    );
  }

  ionViewWillEnter(){
    console.log('ENTER ModelDetailDiagramPage')
  }

  ngAfterContentInit() {
    this.map = document.getElementById("map");
    console.log(this.map);
    if (this._model) {
        this.draw(this._model);
    }
  }

  ionViewDidUnload(){
    console.log('UNLOAD ModelDetailDiagramPage')
  }

  ionViewDidLeave(){
    console.log('LEAVE ModelDetailDiagramPage');
  }

  ngOnDestroy() {
    console.log("DESTROY ModelDetailDiagramPage");
    this._modelSubscription.unsubscribe();
  }

  draw (model : Model) {
    console.log('******DRAW******');
    //console.log(this.map)
    let w = this.map.clientWidth;
    let h = this.map.clientHeight;
    console.log(`size = ${h} / ${w}`);
    if (this.map && this.map.clientWidth > 0) {
      let graph = new joint.dia.Graph;
      let el = this.map;//.nativeElement;
      let paper = new joint.dia.Paper({
          el       : el,
          width    : el.clientWidth,
          height   : el.clientHeight,
          gridSize : 1,
          model    : graph,
          perpendicularLinks : true
        });

        /*paper.on('cell:pointerclick',
         function (cellView, evt, x, y) {
             var dsp = $('#dsp').text();
             var m = cellView.model
             //var data = m.attributes.prop.data;
             window.location = "index.html?view=model_param&block_label=" + m.id + "&model_name=" + json['model_name'];
         });*/

      graph.fromJSON(model);
      /*var rect = new joint.shapes.basic.Rect({
         position: { x: 100, y: 30 },
         size: { width: 100, height: 30 },
         attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
       });
       graph.addCell(rect);*/

       paper.scaleContentToFit();
       //paper.setOrigin(paper.options.origin["x"], 50);
    }
  }
}
