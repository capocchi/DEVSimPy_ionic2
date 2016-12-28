import {Injectable} from '@angular/core';
import {SimData, DataResult, UrlResult, Diagram, TimeValueDiagram, XYDiagram, BarDiagram, PlotSelection} from '../../data-types/result-diagram-types';
declare var Plotly : any;

@Injectable()
export class VisualizationService {
  public plotSelections : Array<PlotSelection>;
  //
  private _urls;
  public selectedUrl : String;
  //
  private _graphDiv : any;
  private _dataType : string;
  private _diagrams;
  private _layout   : any;
  private _showTimeout;
  private _showOn : boolean;
  private _maxX : number = 0;
  private _maxY : number = 0;
  private _minX : number = 0;
  private _minY : number = 0;

  constructor () {
    this.reset();
  }

  public reset() {
    this.plotSelections = [];
    /* Variable for display from URL */
    this._urls      = {};
    this.selectedUrl = '';
    /* Variables for building a graph from data */
    this._diagrams  = {};
    this._dataType = '';
    this._layout   = null;
    this._showOn   = false;
    this._maxX = 0;
    this._maxY = 0;
    this._minX = 0;
    this._minY = 0;
    if (this._graphDiv) {
      Plotly.purge(this._graphDiv.nativeElement);
    }
    this._showOn = false;
    if (this._showTimeout) {clearTimeout(this._showTimeout)}
  }

  public setGraphDiv(div) {
    this._graphDiv = div;
  }

  public addUrlResult(result : UrlResult) {
    if (this._urls[result.label]) {
      // Update URL
      this._urls[result.label] = result.plotUrl;
    }
    else {
      // Create new plot choice
      this._urls[result.label] = result.plotUrl;
      this.plotSelections.push({label : result.label, checked : false});
    }
  }

  public addDataStream() {
    //TODO
  }

  public addDataResult(result : DataResult) {
    if (this._diagrams[result.label]) {
      if (SimData.typeOfData(result.result.value) === this._diagrams[result.label].getTypeOfData()) {
        this._diagrams[result.label].addData(result.result);
      }
    }
    else {
      let newDiagram : Diagram;
      let layout = null;
      if (result.result.value.layout) {layout = result.result.value.layout}

      switch (SimData.typeOfData(result.result.value)) {
        case 'TimeSeries':
          newDiagram = new TimeValueDiagram(result.label, layout);
          break;
        case 'XY':
          newDiagram = new XYDiagram(result.label, layout);
          // TODO move layout and markers info to live stream info
          if (result.result.value.marker) {
            newDiagram.setMarker(result.result.value.marker)};
          break;
        case 'Bars':
          newDiagram = new BarDiagram(result.label, layout);
          break;
        default:
          console.log('UNKNOWN DATA TYPE');
      }
      if (newDiagram) {
        newDiagram.addData(result.result);
      }
      this._diagrams[result.label] = newDiagram;
      this.plotSelections.push({label : result.label, checked : false});
    }
  }

  public show(visu){
    // **** VISU used as THIS ****//
    // When called through setTimeout, THIS is no more referring to the object
    visu._showOn = true;
    visu.selectedUrl = '';
    visu._dataType = '';
    let plotlyData = [];

    if (visu._showTimeout) {
      // Avoid multiple timeouts
      clearTimeout(visu._showTimeout);
    }

    // Parse checked diagrams
    visu.plotSelections.forEach(p => {
      if (p.checked) {
        // Graph from URL
        if (visu._urls[p.label] && !visu.selectedUrl){
          visu.selectedUrl = visu._urls[p.label];
        }
        // Graph from data : first check compatibility
        // If selected diagrams are not compatible with the first selected one
        // then set the following as unchecked
        else {
          let diagram = visu._diagrams[p.label];
          if (!visu._dataType) {
            visu._dataType = diagram.getTypeOfData();
            visu._layout   = diagram.getLayout();
            plotlyData.push(visu._diagrams[p.label].getData());
          }
          else {
            if (diagram.getTypeOfData() === visu._dataType) {
              diagram.updateLayoutforCompatibility(visu._layout);
              plotlyData.push(visu._diagrams[p.label].getData());
            } else {
              p.checked = false;
            }
          }
        }
      }
    });
    // Make graph from data
    Plotly.newPlot( visu._graphDiv.nativeElement, plotlyData, visu._layout );
    visu._showTimeout = setTimeout(visu.show, 1000, visu);
  }
}
