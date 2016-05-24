import {Page, NavController, NavParams} from 'ionic-angular';
import { ModelService } from '../../providers/model-service/model-service';
import { ModelDetailParamPage } from '../model-detail-param/model-detail-param';

@Page({
  templateUrl: 'build/pages/model-detail-block/model-detail-block.html'
})
export class ModelDetailBlockPage {

  constructor(public nav: NavController,
              private _modelService: ModelService) {}

  goToParam(blockLabel : String){
    this.nav.push(ModelDetailParamPage, {blockLabel : blockLabel});
  }

}
