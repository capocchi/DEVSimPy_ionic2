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
      let param : BlockParam = {'name' : key, 'value':xParams[key]};
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
      output[param.name] = param.value;
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

export class Simulation {
  constructor (public simu_name : string,
               public info : any){}

  public toStatus() : string {
    let xStatus = this.info.status;
    let iStatus : string;//SimulationStatus;
    if (xStatus === "RUNNING") {iStatus = "RUNNING"}
    else if (xStatus === "PAUSED") {iStatus = "PAUSED"}
    else if (xStatus === "FINISHED with exit code 0") {iStatus = "FINISHED_OK"}
    else if (xStatus.slice(0,8) === "FINISHED") {iStatus = "FINISHED_NOK"}
    else {iStatus = "UNEXPECTED"}
    return iStatus;
  }
}

export class Result {
  constructor (public label : string,
               public value : number
             ) {}
}
