import {Page, NavController, NavParams} from 'ionic-angular';

/*
  Generated class for the ResultUrlPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/result-url/result-url.html',
})
export class ResultUrlPage {

  plotUrl : string = ''
  modelName : string = ''
  resultLabel : string = ''
  constructor(public nav: NavController,
              public navParams: NavParams) {
    this.plotUrl = this.navParams.get('plotUrl');
    this.modelName = this.navParams.get('modelName');
    this.resultLabel = this.navParams.get('resultLabel');
    }
}
