/*******************************************************************************************/
// SERVER
export interface ServerParam {
  // This interface is necessary for use within Angular template syntax
  name  : string;
  value : string;
}
export class Server {
  constructor (public url : string,
               public isConnected : boolean,
              // login/password?
               public info : any) {};

  reformatInfo() {
    let res = [];
    Object.keys(this.info).forEach(key => {
      res.push({'name':key, 'value':this.info[key].toString()});
    })
    this.info = res;
  }
}
/*******************************************************************************************/
//export interface BlockParam { [name:string] : any } --> not usable
export interface BlockParam {
  // This interface is necessary for use within Angular template syntax
  type  : string;
  name  : string;
  value : any;
}

export class Block {
  label  : string;
  params : Array<BlockParam>

  constructor (label:string, xParams : any) {
    this.label = label;
    this.params = [];
    Object.keys(xParams).forEach(key => {
      let paramType = typeof xParams[key];
      if (paramType === 'string') {
        if (xParams[key].endsWith('.jpg') || xParams[key].endsWith('.png')) {
          paramType = 'image';
        }
      }
      let param : BlockParam = {name  : key,
                                value : xParams[key],
                                type  : paramType};
      this.params.push(param);
    })
    /*Object.keys(xParams).forEach(key => {
      let bp = {}
      bp[key] = xParams[key]
      block.params.push(bp);
    })*/
  }

  public toJSONstring () : string {
    let output = {}
    this.params.forEach( param => {
      switch (param.type) {
        case 'boolean' : {output[param.name] = Boolean(param.value); break}
        case 'number' : {output[param.name] = Number(param.value); break}
        default : {output[param.name] = param.value; break}
      }
    })
    return JSON.stringify(output);
  }

}

export class Model {
  public cells        : Array<any>;
  public atomicBlocks : Array<Block>
  public description  : String;

  constructor (public model_name:string,
               public last_modified:string,
               public size:number ){
    this.cells        = [];
    this.atomicBlocks = [];
    this.description  = "";
  }

  reset (last_modified:string,
         size:number ){
    this.last_modified = last_modified;
    this.size          = size;
    this.cells         = [];
    this.atomicBlocks  = [];
    this.description   = "";
  }

  update (modelWS:any) {
    this.cells       = modelWS.cells; //--> used for Diagram
    this.description = modelWS.description;
    // Extract atomic blocks and parameters for easier manipulation
    this.cells.forEach(cell => {
      if (cell.type === 'devs.Atomic') {
        this.atomicBlocks.push(new Block(cell.id, cell.prop.data));
      }
    })
  }

}
/******************************************************************************/
//export enum SimulationStatus { NOT_STARTED, RUNNING, PAUSED, FINISHED_OK, FINISHED_NOK, UNEXPECTED }
// Find out how to use it in the ngSwitch directive
export interface SimulationOutput {
  label   : string;
  plotUrl? : string;
  filename? : string;
  checked? : boolean;
}

export class Simulation {

  constructor (public simu_name : string,
               public info : any){}

  public toColor() : string {
    let xStatus = this.info.status;
    let xcode   = this.info.exit_code;
    let color   = 'primary'
    if (xStatus === "RUNNING") {color = 'secondary'} // green
    else if (xStatus === "PAUSED") {color = 'light'} // grey
    else if (xStatus === "FINISHED") {
      if (xcode == 0) {color = 'primary'} // blue
      else {color = 'danger'} // red
    }
    return color;
  }
}

export class Result {
  constructor (public label : string,
               public value : number
             ) {}
}
