
/*************************************************/
// Results
/*************************************************/
export class SimData {
  time  : number;
  value : any;

  public static typeOfData(value) {
    if (typeof(value) == 'number') {
      return 'TimeSeries';
    }
    else if (value.x && value.y) {
      return 'XY';
    }
    else if (value.labels && value.scores) {
      return 'Bars';
    }
    else {
      return 'UNKNOWN'
    }
  }
};


export interface DataResult {
  label   : string;
  result  : SimData;
}

export interface UrlResult {
  label    : string;
  plotUrl  : string;
}

/*************************************************/
// Results format for Plotly
/*************************************************/
export interface PlotlyDataSet {
    x    : Array<any>;
    y    : Array<any>;
    type : String;
    mode : String;
    name : String;
}

/*************************************************/
// Different kinds of data and diagrams
/*************************************************/
export abstract class Diagram {
  protected _data   : PlotlyDataSet;
  protected _layout : any;

  constructor (label : String, layout : any = {}) {
    console.log('init Diagram ' + label)
    this._data = {
       x : [],
       y : [],
       type : '',
       mode : '',
       name : label
     }
     this._layout = layout;
  }

  public abstract addData (data : SimData);

  public getLayout() {
    return this._layout;
  }

  public abstract getDiagramType();

  public abstract getDiagramMode();

  public getData() {
    this._data.mode = this.getDiagramMode();//TODO déplacer dans les enfants
    this._data.type = this.getDiagramType();
    return this._data;
  }

  public updateLayoutforCompatibility(layout) {
    return layout;
  }

  public getLabel() {
    return this._data.name;
  }

  public getTypeOfData() {
    return 'UNKNOWN';
   }
}

export class XYDiagram extends Diagram {

  private _currentTime : number;
  private _markers : any;
  private _keepXY  : boolean = false;//indicates that xy data shall not be erased when time increase

  private _maxX : number = 0;
  private _maxY : number = 0;
  private _minX : number = 0;
  private _minY : number = 0;

  constructor (label : string, layout : any = {}, markers : any = {}) {
    super(label, layout);
    this._currentTime = -1;
    this._markers = markers;
  }

  public getTypeOfData() {
    return 'XY';
  }

  public getDiagramType() {
    return 'scatter';
  }

  public getDiagramMode() {
    return 'markers';
  }

  public getLayout() {
    return {
      xaxis : {'range': [1.1*this._minX, 1.1*this._maxX], 'showgrid':false},
			yaxis : {'range': [
        1.1*this._minY, 1.1*this._maxY], 'title':''},
			showlegend: true,
      legend: {orientation:'h'},
      margin: {l: 40, b: 20, r: 10, t: 10}// update the left, bottom, right, top margin
    }
  };

  public addData (data : SimData) {
    if (this._data.name === 'InterceptorsUpdate') {
      console.log(data.value.source + ' ' + data.time) }
    if ((data.time - this._currentTime) > 1.0) {
      this._currentTime = data.time;
      if (!this._keepXY) {
        if (this._data.name === 'InterceptorsUpdate') {
          console.log('reset ' + this._data.name)}
        this._data.x = [];
        this._data.y = [];
      }
    }
    this._data.x.push(data.value.x);
    this._data.y.push(data.value.y);
    if (data.value.x < this._minX) {this._minX = data.value.x;}
    if (data.value.x > this._maxX) {this._maxX = data.value.x;}
    if (data.value.y < this._minY) {this._minY = data.value.y;}
    if (data.value.y > this._maxY) {this._maxY = data.value.y;}
  }

  public nbData() {
    return this._data.x.length;
  }
  
  public updateLayoutforCompatibility(layout) {
    if (this._minX < layout.xaxis.range[0]) {layout.xaxis.range[0] = this._minX}
    if (this._maxX > layout.xaxis.range[1]) {layout.xaxis.range[1] = this._maxX}
    if (this._minY < layout.yaxis.range[0]) {layout.yaxis.range[0] = this._minY}
    if (this._maxY > layout.yaxis.range[1]) {layout.yaxis.range[1] = this._maxY}
  }

}

export class TimeValueDiagram extends Diagram {

  constructor(label : String, layout : any = {}) {
    super(label, layout);
    if (!layout) {
      this._layout = {
        yaxis: {title: ''},
        xaxis: {showgrid: false}
        //margin: {l: 40, b: 20, r: 10, t: 10}// left, bottom, right, top margins
      }
    }
  }

  public getTypeOfData() {
    return 'TimeSeries';
  }

  public getDiagramType() {
    return 'scatter';
  }

  public getDiagramMode() {
    return 'lines'
  }

  public addData(data : SimData) {
    this._data.x.push(data.time);
    this._data.y.push(data.value);
  }

}

export class BarDiagram extends Diagram {

  constructor(label : String, layout : any = {}) {
    super(label, layout);
    if (!layout) {
      this._layout = {
        xaxis: {tickangle: -45} // Label inclination
      }
    }
  }

  public getTypeOfData() {
    return 'Bars';
  }

  public getDiagramType() {
    return 'bar';
  }

  public getDiagramMode() {
    return ''
  }

  public addData(data : SimData) {
    data.value.labels.forEach(l => {this._data.x.push(l);})
    data.value.scores.forEach(s => {this._data.y.push(s);})
  }
}

/*************************************************/
// Different ways to receive the results
/*************************************************/
export interface PlotSelection {
  label    : string;
  checked  : boolean; // checked means that the user has selected the data for Visualization (using a checkbox)
}
