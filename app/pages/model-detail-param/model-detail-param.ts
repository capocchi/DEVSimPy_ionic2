import { Page, NavController, NavParams, Alert } from 'ionic-angular';
import { ModelService } from '../../providers/model-service/model-service';
import { SimulationService } from '../../providers/simulation-service/simulation-service';
import { Block, BlockParam } from '../../data-types/data-types';
import { Geolocation } from 'ionic-native';
import { Camera } from 'ionic-native';

@Page({
  templateUrl: 'build/pages/model-detail-param/model-detail-param.html',
})
export class ModelDetailParamPage {

  private _blockLabel: String;
  private _blockLocalCopy: Block;

  constructor(public nav: NavController,
              public navParams: NavParams,
              private _modelService : ModelService,
              private _simulationService: SimulationService) {
    this._blockLabel = navParams.get('blockLabel');
    this._blockLocalCopy = null;
  }

  onPageWillEnter(){
    this._modelService.selectedModel$.subscribe(
      data  => {
        this._blockLocalCopy = data.atomicBlocks.find(item => { return item.label === this._blockLabel });
      },
      error => {console.log(error);}
    )
  }

  saveParam(){
    console.log("save params");
    this._modelService.saveModelParameters(this._blockLocalCopy).then(
      text => {this.displayAlert(text)}
    );
  }

  modifyParam(){
    console.log("modify params");
    this._simulationService.modifyModelParameters(this._blockLocalCopy).then(
      text => {this.displayAlert(text)}
    );
  }

  public showPhoneInputs(param : BlockParam){
    let alert = Alert.create();

    alert.setTitle('Select phone input');
    alert.addInput({type: 'checkbox', label: 'Geolocation', value: 'Geolocation'});
    alert.addInput({type: 'checkbox', label: 'Camera', value: 'Camera'});

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Next',
      handler: data => {
        switch (data[0]){
          case 'Geolocation': {this.showLocation(param); break;}
          case 'Camera'     : {this.takePicture(param); break;}
          default: break;
        }
      }
    });

    this.nav.present(alert);
  }

  public showLocation(param : BlockParam){

    Geolocation.getCurrentPosition({maximumAge: 3000, timeout: 5000, enableHighAccuracy: true}).then(
      position => {
        let alert = Alert.create();
        alert.setTitle('Select geolocation input');
        alert.addInput({type: 'checkbox', label: `latitude : ${position.coords.latitude}`, value: 'latitude'});
        alert.addInput({type: 'checkbox', label: `longitude : ${position.coords.longitude}`, value: 'longitude'});
        alert.addInput({type: 'checkbox', label: `altitude : ${position.coords.altitude}`, value: 'altitude'});
        alert.addInput({type: 'checkbox', label: `heading : ${position.coords.heading}`, value: 'heading'});

        alert.addButton('Cancel');
        alert.addButton({
          text: 'OK',
          handler: data => {
            console.log('Checkbox data:', data);
            switch (data[0]){
              case 'latitude': {param.value = position.coords.latitude; break;}
              case 'longitude': {param.value = position.coords.longitude; break;}
              case 'altitude': {param.value = position.coords.altitude; break;}
              case 'heading': {param.value = position.coords.heading; break;}
              default: return 0.0;
            }
          }
        });

        this.nav.present(alert);

      },
      error => {this.displayAlert(error.message)}
    );
  }
  public takePicture(param : BlockParam){
    // See options definition here :
    // https://github.com/driftyco/ionic-native/blob/master/src/plugins/camera.ts
    let options = {
            destinationType: 1,// 0:base-64 encoded string/1:FileURI/2:NativeURI
            sourceType: 1,// 0:PhotoLibrary/1:Camera/2:SavedPhotoAlbum
            encodingType: 0,// 0:JPEG/1:PNG
            quality:100,
            allowEdit: false,
            saveToPhotoAlbum: false
        };
    Camera.getPicture(options).then(
      img => {
        /*let base64Image = "data:image/jpeg;base64," + img;
        param.value=JSON.stringify(base64Image);*/

        this._modelService.uploadPicture(img, this._blockLocalCopy.label)
        .then (response => {
          console.log(response);
          param.type = 'image';
          param.value = response;
        })
        .catch (error => {
          console.log(error);
          this.displayAlert("Image upload failed.")
        });

      },
      error => {this.displayAlert(error.message)}
    );

  }

  private displayAlert(text : string) {
    let alert = Alert.create({
      title : text,
      buttons: [{
      text: 'OK',
      handler: () => {
        alert.dismiss();
        //let navTransition = alert.dismiss();
        //navTransition.then(() => {this.nav.pop();});
        return false;
      }
      }]
    });
    this.nav.present(alert);

  }
}
