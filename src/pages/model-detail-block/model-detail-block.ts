import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ModelService } from '../../providers/model-service/model-service';
import { ModelDetailParamPage } from '../model-detail-param/model-detail-param';

@Component({
  templateUrl: 'model-detail-block.html'
})
export class ModelDetailBlockPage {

  constructor(public nav: NavController,
              public _modelService: ModelService) {}

  goToParam(blockLabel : String){
    this.nav.push(ModelDetailParamPage, {blockLabel : blockLabel});
  }

}
